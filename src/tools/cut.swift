import Foundation
import CoreGraphics
import ImageIO
import CoreImage
import Vision
import UniformTypeIdentifiers

// usage: cut <in> <out.png> <lift|keep>
// keep: image already has real transparency. lift: lift the foreground subject with Vision (for baked-in backgrounds).
// Either way the result is cropped tightly to the subject (alpha > 16) with a small transparent margin.

func load(_ path: String) -> CGImage? {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

func rgba(_ img: CGImage) -> (UnsafeMutablePointer<UInt8>, Int, Int) {
    let w = img.width, h = img.height
    let p = UnsafeMutablePointer<UInt8>.allocate(capacity: w * h * 4)
    p.initialize(repeating: 0, count: w * h * 4)
    let ctx = CGContext(data: p, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                        space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
    return (p, w, h)
}

let a = CommandLine.arguments
guard a.count >= 4, var img = load(a[1]) else { print("cannot load \(a.count > 1 ? a[1] : "")"); exit(1) }

if a[3] == "lift" {
    let req = VNGenerateForegroundInstanceMaskRequest()
    let handler = VNImageRequestHandler(cgImage: img, options: [:])
    try handler.perform([req])
    guard let obs = req.results?.first else { print("no foreground found"); exit(2) }
    let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
    let ci = CIImage(cvPixelBuffer: buf)
    guard let cg = CIContext().createCGImage(ci, from: ci.extent) else { print("render failed"); exit(3) }
    img = cg
}

let (p, w, h) = rgba(img)
var minX = w, minY = h, maxX = -1, maxY = -1
var transparent = 0
for y in 0..<h { for x in 0..<w {
    let al = p[(y * w + x) * 4 + 3]
    if al < 250 { transparent += 1 }
    if al > 16 { if x < minX { minX = x }; if x > maxX { maxX = x }; if y < minY { minY = y }; if y > maxY { maxY = y } }
} }
print("\(a[1].split(separator: "/").last!): \(w)x\(h) transparent=\(String(format: "%.0f", Double(transparent) * 100 / Double(w * h)))% bbox=(\(minX),\(minY))-(\(maxX),\(maxY))")
if maxX < 0 { print("empty"); exit(4) }

let pad = Int(Double(max(maxX - minX, maxY - minY)) * 0.015)
let cx0 = max(0, minX - pad), cy0 = max(0, minY - pad), cx1 = min(w - 1, maxX + pad), cy1 = min(h - 1, maxY + pad)
let cw = cx1 - cx0 + 1, ch = cy1 - cy0 + 1
let ctx = CGContext(data: p, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
guard let full = ctx.makeImage(), let crop = full.cropping(to: CGRect(x: cx0, y: cy0, width: cw, height: ch)) else { exit(5) }
guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.png.identifier as CFString, 1, nil) else { exit(6) }
CGImageDestinationAddImage(dest, crop, nil)
CGImageDestinationFinalize(dest)
print("  -> \(a[2]) \(cw)x\(ch)")
