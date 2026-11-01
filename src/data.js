/* Illustrative catalogue. Brand names are used for realism; prices, part numbers and dealers are invented.
   Photos: Unsplash (Unsplash License) and Wikimedia Commons (CC BY / CC BY-SA, credited in the case study). */
const C = n => `assets/cut/${n}.avif`, PH = n => `assets/photo/${n}.jpg`;

const VEHICLES = {
  creta:{id:'creta',type:'car',name:'Hyundai Creta',short:'Creta',variant:'SX 1.5 CRDi',fuel:'Diesel',year:2024,plate:'TN 09 BX 4821',trans:'Manual',odo:'41,200 km',img:'assets/cut/creta-official.avif',spin:36},
  m575:{id:'m575',type:'tractor',name:'Mahindra 575 DI',short:'575 DI',variant:'XP Plus',fuel:'Diesel',year:2021,plate:'TN 41 AK 2207',trans:'8F + 2R',odo:'2,340 hrs',img:C('m575-official')},
  signa:{id:'signa',type:'truck',name:'Tata Signa 4825.TK',short:'Signa',variant:'Tipper 10x4',fuel:'Diesel',year:2022,plate:'TN 37 DM 6614',trans:'9-speed',odo:'1,84,000 km',img:C('excon-truck')},
  jcb:{id:'jcb',type:'excavator',name:'JCB 30 Plus',short:'30 Plus',variant:'Mini excavator',fuel:'Diesel',year:2020,plate:'Asset CBE-07',trans:'Hydrostatic',odo:'3,910 hrs',img:C('jcb30-official')}
};
const GARAGE = ['creta','m575','signa','jcb'];

const PRODUCTS = [
  /* brake discs (Creta front) */
  {id:'d1',cat:'brakes',wheel:16,brand:'Bosch',name:'Front Brake Disc Rotor, Ventilated (Pair)',tier:'OES',style:'Plain',position:'Front',price:4650,mrp:5400,rating:4.7,reviews:842,fits:['creta'],dealers:3,eta:'Today',pn:'0 986 479 C91',oe:'51712-C9000',img:C('rotor-plain'),best:true,warranty:'12 months'},
  {id:'d2',cat:'brakes',wheel:16,brand:'Hyundai Mobis',name:'Genuine Front Brake Disc (Pair)',tier:'OE Genuine',style:'Plain',position:'Front',price:5980,mrp:6200,rating:4.8,reviews:311,fits:['creta'],dealers:4,eta:'Today',pn:'51712-C9000',oe:'51712-C9000',img:C('rotor-solid'),warranty:'12 months'},
  {id:'d3',cat:'brakes',wheel:16,brand:'Brembo',name:'Max Slotted Front Brake Disc (Pair)',tier:'Premium',style:'Slotted',position:'Front',price:6450,mrp:7300,rating:4.7,reviews:126,fits:['creta'],dealers:1,eta:'Today',pn:'09.C932.75',oe:'51712-C9000',img:C('rotor-sslot'),warranty:'24 months'},
  {id:'d4',cat:'brakes',wheel:16,brand:'Brembo',name:'Xtra Cross-Drilled Front Brake Disc (Pair)',tier:'Premium',style:'Drilled',position:'Front',price:7200,mrp:8100,rating:4.6,reviews:88,fits:['creta'],dealers:1,eta:'Tomorrow',pn:'09.C932.1X',oe:'51712-C9000',img:C('rotor-sdrill'),warranty:'24 months'},
  {id:'d5',cat:'brakes',wheel:16,brand:'TVS Girling',name:'Front Brake Disc, Ventilated (Pair)',tier:'OES',style:'Plain',position:'Front',price:3890,mrp:4500,rating:4.5,reviews:604,fits:['creta'],dealers:5,eta:'Today',pn:'TG-BD-2271',oe:'51712-C9000',img:C('rotor-cslot'),warranty:'12 months'},
  {id:'d6',cat:'brakes',wheel:16,brand:'Fitwise Select',name:'Drilled & Slotted Front Disc (Pair)',tier:'Value',style:'Drilled & slotted',position:'Front',price:3490,mrp:4600,rating:4.3,reviews:1204,fits:['creta'],dealers:6,eta:'Today',pn:'FW-BD-C9-DS',oe:'51712-C9000',img:C('rotor-dsl'),warranty:'6 months'},
  {id:'d7',cat:'brakes',wheel:16,brand:'Rane',name:'Sport Cross-Drilled Front Disc (Pair)',tier:'OES',style:'Drilled',position:'Front',price:4100,mrp:4800,rating:4.4,reviews:240,fits:['creta'],dealers:2,eta:'Today',pn:'RBL-BD-5512',oe:'51712-C9000',img:C('rotor-cdrill'),warranty:'12 months'},
  {id:'d8',cat:'brakes',wheel:17,brand:'Valeo',name:'Curved Drilled & Slotted Disc, 17-inch (Pair)',tier:'Premium',style:'Drilled & slotted',position:'Front',price:5600,mrp:6300,rating:4.5,reviews:64,fits:[],variant:['creta'],variantNote:'Only for Creta builds on 17-inch wheels (SX automatic, SX(O)). Check yours first',dealers:1,eta:'Tomorrow',pn:'VL-197332',oe:'51712-C9100',img:C('rotor-cdsl'),warranty:'12 months'},
  {id:'d9',cat:'brakes',brand:'Brembo',name:'Front Brake Disc for Verna 1.5 (Pair)',tier:'Premium',style:'Plain',position:'Front',price:5200,mrp:5900,rating:4.6,reviews:73,fits:[],dealers:1,eta:'Tomorrow',pn:'09.D112.11',oe:'51712-H5000',img:C('rotor-plain'),warranty:'24 months'},
  /* tyres */
  {id:'t1',cat:'tyres',wheel:16,brand:'MRF',name:'Wanderer Street 205/65 R16 95H',tier:'Premium',size:'205/65 R16',use:'City + highway',speed:'H · 210 km/h',load:'95 (690 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:7790,mrp:8500,rating:4.6,reviews:842,fits:['creta'],dealers:5,eta:'Today',pn:'MRF-WS-2056516',img:C('tyre-stack'),best:true,warranty:'5 years'},
  {id:'t2',cat:'tyres',wheel:16,brand:'Michelin',name:'Primacy 4 ST 205/65 R16 95H',tier:'Premium',size:'205/65 R16',use:'Highway',speed:'H · 210 km/h',load:'95 (690 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:10950,mrp:11800,rating:4.8,reviews:356,fits:['creta'],dealers:2,eta:'Today',pn:'MIC-P4ST-20565',img:PH('tyre-dark'),photo:true,warranty:'5 years'},
  {id:'t3',cat:'tyres',wheel:16,brand:'Apollo',name:'Alnac 4G 205/65 R16 95V',tier:'Mid',size:'205/65 R16',use:'City + highway',speed:'V · 240 km/h',load:'95 (690 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:7190,mrp:7900,rating:4.4,reviews:530,fits:['creta'],dealers:6,eta:'Today',pn:'APL-A4G-20565',img:C('apollo-tyre'),warranty:'5 years'},
  {id:'t4',cat:'tyres',wheel:16,brand:'CEAT',name:'CrossDrive AT 205/65 R16 95H',tier:'Mid',size:'205/65 R16',use:'All-terrain',speed:'H · 210 km/h',load:'95 (690 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:8290,mrp:8900,rating:4.4,reviews:289,fits:['creta'],dealers:4,eta:'Today',pn:'CEAT-CDAT-20565',img:PH('tyre-tread'),photo:true,warranty:'5 years'},
  {id:'t5',cat:'tyres',wheel:16,brand:'JK Tyre',name:'UX Royale 205/65 R16 95H',tier:'Value',size:'205/65 R16',use:'City',speed:'H · 210 km/h',load:'95 (690 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:6790,mrp:7400,rating:4.2,reviews:604,fits:['creta'],dealers:3,eta:'Tomorrow',pn:'JK-UXR-20565',img:PH('tyre-wheel'),photo:true,warranty:'4 years'},
  {id:'t6',cat:'tyres',wheel:16,brand:'Bridgestone',name:'Ecopia EP150 205/65 R16 95H',tier:'Mid',size:'205/65 R16',use:'City',speed:'H · 210 km/h',load:'95 (690 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:8390,mrp:9100,rating:4.5,reviews:412,fits:['creta'],dealers:3,eta:'Today',pn:'BS-EP150-20565',img:PH('tyre-alloy'),photo:true,warranty:'5 years'},
  {id:'t10',cat:'tyres',wheel:17,brand:'MRF',name:'Wanderer Street 215/60 R17 96H',tier:'Premium',size:'215/60 R17',use:'City + highway',speed:'H · 210 km/h',load:'96 (710 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:8450,mrp:9200,rating:4.6,reviews:518,fits:[],variant:['creta'],variantNote:'Only for Creta builds on 17-inch wheels (SX automatic, SX(O)). Check your sidewall first',dealers:4,eta:'Today',pn:'MRF-WS-2156017',img:C('tyre-stack'),warranty:'5 years'},
  {id:'t11',cat:'tyres',wheel:17,brand:'Apollo',name:'Alnac 4G 215/60 R17 96V',tier:'Mid',size:'215/60 R17',use:'City + highway',speed:'V · 240 km/h',load:'96 (710 kg)',cons:'Tubeless radial',press:'33 psi front and rear',tread:'8.2 mm',price:7890,mrp:8600,rating:4.4,reviews:311,fits:[],variant:['creta'],variantNote:'Only for Creta builds on 17-inch wheels (SX automatic, SX(O)). Check your sidewall first',dealers:5,eta:'Today',pn:'APL-A4G-21560',img:C('apollo-tyre'),warranty:'5 years'},
  {id:'t7',cat:'tyres',brand:'MRF',name:'Shakti Super 13.6-28 Rear Tractor Tyre',tier:'Premium',size:'13.6-28',use:'Farm, rear',speed:'A6',load:'12 ply',cons:'Bias ply, tube type',press:'16–18 psi in the field',tread:'Lug height 38 mm',price:21500,mrp:23400,rating:4.7,reviews:1130,fits:['m575'],dealers:4,eta:'Today',pn:'MRF-SS-13628',img:C('tractor-tyre'),warranty:'3 years'},
  {id:'t8',cat:'tyres',brand:'BKT',name:'Commander 13.6-28 Rear Tractor Tyre',tier:'Mid',size:'13.6-28',use:'Farm, rear',speed:'A6',load:'12 ply',cons:'Bias ply, tube type',press:'16–18 psi in the field',tread:'Lug height 36 mm',price:19800,mrp:21000,rating:4.5,reviews:640,fits:['m575'],dealers:3,eta:'Today',pn:'BKT-CMD-13628',img:PH('tractor-tyre-red'),photo:true,warranty:'3 years'},
  {id:'t9',cat:'tyres',brand:'Apollo',name:'EnduRace RD 295/80 R22.5 Drive Tyre',tier:'Mid',size:'295/80 R22.5',use:'Truck, drive axle',speed:'L · 120 km/h',load:'152/148 (3,550 kg single)',cons:'Tubeless radial',press:'120 psi',tread:'17 mm',price:25400,mrp:27100,rating:4.4,reviews:174,fits:['signa'],dealers:3,eta:'Today',pn:'APL-ERD-29580',img:PH('tyre-tread'),photo:true,warranty:'6 years'},
  /* tracks */
  {id:'k1',cat:'tracks',links:80,brand:'Fitwise TrakPro',name:'Rubber Track 300 × 52.5 × 80, Block tread',tier:'Premium',size:'300 × 52.5 × 80',pattern:'Block',core:'Continuous steel',price:62000,mrp:71000,rating:4.6,reviews:84,fits:['jcb'],dealers:2,eta:'Today',pn:'FW-TR-30052-80B',img:C('rubber-track'),best:true,warranty:'18 months'},
  {id:'k2',cat:'tracks',links:80,brand:'Bridgestone',name:'Rubber Track 300 × 52.5 × 80, Zig-zag',tier:'OES',size:'300 × 52.5 × 80',pattern:'Zig-zag',core:'Continuous steel',price:78500,mrp:84000,rating:4.8,reviews:51,fits:['jcb'],dealers:1,eta:'Tomorrow',pn:'BS-RT-3005280Z',img:PH('deere-track'),photo:true,warranty:'24 months'},
  {id:'k3',cat:'tracks',links:80,brand:'JCB',name:'Genuine Rubber Track 300 × 52.5 × 80',tier:'OE Genuine',size:'300 × 52.5 × 80',pattern:'Block',core:'Continuous steel',price:92000,mrp:92000,rating:4.9,reviews:22,fits:['jcb'],dealers:1,eta:'Tomorrow',pn:'JCB-332-Y5216',img:PH('tracks-sand'),photo:true,warranty:'24 months'},
  {id:'k4',cat:'tracks',links:84,brand:'Fitwise TrakPro',name:'Rubber Track 300 × 52.5 × 84, Block tread',tier:'Premium',size:'300 × 52.5 × 84',pattern:'Block',core:'Continuous steel',price:64500,mrp:73000,rating:4.5,reviews:19,fits:[],variant:['jcb'],variantNote:'Only for 30 Plus machines that run 84 links. Count the links on your old track first',dealers:1,eta:'Today',pn:'FW-TR-30052-84B',img:C('rubber-track'),warranty:'18 months'}
];

const DEALERS = [
  {id:'s4',name:'Fitwise Hub, Avinashi Road',area:'Lakshmi Mills',rating:4.8,reviews:1204,open:'Open until 10 PM',stock:14,factor:1,fit:true,own:true,lat:11.0112,lon:76.9868},
  {id:'s1',name:'Sri Murugan Auto Spares',area:'Gandhipuram',rating:4.7,reviews:318,open:'Open until 9 PM',stock:6,factor:1,fit:true,lat:11.0178,lon:76.9668},
  {id:'s2',name:'KG Motors & Brakes',area:'RS Puram',rating:4.6,reviews:211,open:'Open until 8 PM',stock:2,factor:.99,fit:true,lat:11.0091,lon:76.9502},
  {id:'s3',name:'Lakshmi Car Care',area:'Saibaba Colony',rating:4.5,reviews:176,open:'Open until 8:30 PM',stock:9,factor:1.03,fit:true,lat:11.0262,lon:76.9447},
  {id:'s5',name:'Velan Spares',area:'Ukkadam',rating:4.3,reviews:94,open:'Closes at 7 PM',closing:true,stock:0,factor:.97,fit:false,lat:10.9908,lon:76.961}
];
/* heavy parts (tractor and truck tyres, tracks) come from a different trade: farm, truck and earthmover dealers */
const DEALERS_HEAVY = [
  {id:'h4',name:'Fitwise Hub, Avinashi Road',area:'Lakshmi Mills',rating:4.8,reviews:1204,open:'Open until 10 PM',stock:3,factor:1,fit:true,own:true,lat:11.0112,lon:76.9868},
  {id:'h1',name:'Kovai Earthmover Spares',area:'Ganapathy',rating:4.6,reviews:142,open:'Open until 8 PM',stock:2,factor:.98,fit:true,lat:11.0402,lon:76.9792},
  {id:'h2',name:'Sakthi Tractors & Implements',area:'Selvapuram',rating:4.5,reviews:388,open:'Open until 7:30 PM',stock:4,factor:1.02,fit:true,lat:10.9858,lon:76.9432},
  {id:'h3',name:'Coimbatore Truck Tyre House',area:'Ramanathapuram',rating:4.4,reviews:97,open:'Closes at 7 PM',closing:true,stock:0,factor:.97,fit:false,lat:10.9978,lon:76.9925}
];
/* shopper's location: PIN 641018, central Coimbatore. Distances are computed from coordinates so list and map always agree */
const ME = {lat:11.0021,lon:76.9649,pin:'641018'};
const kmTo = d => { const R = 6371, r = x => x * Math.PI / 180, a = Math.sin(r(d.lat - ME.lat) / 2) ** 2 + Math.cos(r(ME.lat)) * Math.cos(r(d.lat)) * Math.sin(r(d.lon - ME.lon) / 2) ** 2; return Math.round(R * 2 * Math.asin(Math.sqrt(a)) * 10) / 10; };
[...DEALERS, ...DEALERS_HEAVY].forEach(d => d.km = kmTo(d));

const FACETS = {
  brakes:[
    {k:'avail',label:'Availability',type:'avail'},
    {k:'price',label:'Price',type:'range'},
    {k:'style',label:'Disc type',type:'check',info:'Plain discs are quietest and last longest. Drilled and slotted shed heat faster for hard or hilly driving.'},
    {k:'tier',label:'Quality',type:'check',info:'OE Genuine is carmaker-branded. OES is made by the same supplier under its own brand.'},
    {k:'brand',label:'Brand',type:'check'},
    {k:'rating',label:'Customer rating',type:'rating'}
  ],
  tyres:[
    {k:'avail',label:'Availability',type:'avail'},
    {k:'price',label:'Price',type:'range'},
    {k:'size',label:'Tyre size',type:'check'},
    {k:'use',label:'Driving use',type:'check'},
    {k:'speed',label:'Speed rating',type:'check'},
    {k:'brand',label:'Brand',type:'check'},
    {k:'rating',label:'Customer rating',type:'rating'}
  ],
  tracks:[
    {k:'avail',label:'Availability',type:'avail'},
    {k:'price',label:'Price',type:'range'},
    {k:'size',label:'Size (width × pitch × links)',type:'check'},
    {k:'pattern',label:'Tread pattern',type:'check'},
    {k:'tier',label:'Quality',type:'check'},
    {k:'brand',label:'Brand',type:'check'},
    {k:'rating',label:'Customer rating',type:'rating'}
  ]
};
const CAT_META = {
  brakes:{title:'Front Brake Discs',tab:'Brake discs',one:'brake disc pair',icon:C('rotor-plain'),crumb:['Car parts','Brakes'],veh:'creta',
    q:'Which brake disc should I choose?',
    qt:'For everyday city and highway driving, a <b>plain ventilated disc</b> is quietest and lasts longest. Choose <b>drilled or slotted</b> only if you drive hard or on ghat roads. Always replace discs <b>in pairs</b>, and fit new pads at the same time.'},
  tyres:{title:'Tyres',tab:'Tyres',one:'tyre',icon:C('tyre-stack'),crumb:['Tyres','By vehicle'],veh:'creta',
    q:'How do I pick the right tyre?',
    qt:'Your Creta SX manual left the factory on <span class="mono">205/65 R16 95H</span>; automatics and the SX(O) run <span class="mono">215/60 R17 96H</span>. Read the size off your sidewall to be sure. Replace tyres in pairs on the same axle, and get an alignment with every new set.',
    qtBy:{m575:'Your 575 DI runs <span class="mono">13.6-28</span> at the rear and <span class="mono">6.00-16</span> at the front. Pick a 12-ply lug tyre for mixed field and haulage work, and replace rear tyres <b>as a pair</b>.',
      signa:'Your Signa tipper runs <span class="mono">295/80 R22.5</span>. Use a lug pattern on the drive axle, and match tread depth across twin wheels so they share the load evenly.'}},
  tracks:{title:'Rubber Tracks',tab:'Tracks',one:'track',icon:C('rubber-track'),crumb:['Construction','Tracks'],veh:'jcb',
    q:'How do I read a track size?',
    qt:'Track size is <b>width × pitch × links</b>. Most 30 Plus machines take <span class="mono">300 × 52.5 × 80</span>, but some builds run 84 links. Count the links on your old track first, because one link off and it won\'t tension.'}
};
const fmt = n => '₹' + n.toLocaleString('en-IN');
