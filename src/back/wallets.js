


//VUE MODULE
var vm = new Vue({
  el: '#vmwal',
  data: {
    com: false,
    text:'',
    tokenss: [],
    walletss: [],
    transs: [],
    namaddr: [],
    nowwal: '',
    current:'',
    contr:'',
    sumwal: 0,
    sumcon: 0,
    sumch: 0,
    tweenedNumber: 0,
    rr: '',
    timer: 15,
    status: 0,
    block: [' ', ' ',' '],
    lastt: [' ', ' ',' '],
    txs: [' ', ' ',' '],
    zz: 0, //default neo net
    statusx: 0,
    ala: [' ', ' ',' '],
    sumwalx: 0,
    tokn: '',
    txn: '',
    w: ' ',
    sortt: ['U', 1, 'N', -1],
    login: 0,
    score: 0,
    intr: '?'
    
  },
  
  mounted() {
    
    if (localStorage.namaddr) {	
       this.namaddr = JSON.parse(localStorage.namaddr) ; 
    }
    
    if (localStorage.text) {	
      this.text = localStorage.text;
       }

    if (localStorage.sortt) {	
      this.sortt =  JSON.parse(localStorage.sortt);
      }
    
    if (localStorage.com) {	
      this.com =  JSON.parse(localStorage.com);
         }
  },

  
  computed: {
      animatedNumber: function() {
        return this.tweenedNumber.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 });
      }
    },
  
  watch: {
    namaddr(newnamaddr) {
    const  parsed = JSON.stringify(newnamaddr);
    localStorage.namaddr = parsed
    //updatedb(newnamaddr);
    },
  
    text(newtext) {
      localStorage.text = newtext
      },

    com(newcom) {
      const  parsedc = JSON.stringify(newcom);
    localStorage.com = parsedc
    },
  
  	sumwalx: function(newValue) {
        TweenLite.to(this.$data, 1, { tweenedNumber: newValue });
      },

    sortt(newsortt) {
    const  parsedx = JSON.stringify(newsortt);
    localStorage.sortt = parsedx
      },

  },
  
  });
  
function logi(g,s) { vm.login = g; vm.score = s; };
  
//ADD ADDRESS from NOS and DB
function splitadd(spl) {
  var locext = [], check = [];
  for (var db of spl) {//alert(JSON.stringify(db));
    var i = 0;
   for (var loc of vm.namaddr) {
     if (loc.address == db.address) {++i;break}
   }
   if (i == 0 && check.indexOf(db.address) == -1) {check.push(db.address); locext.push(db) }; 
  }
  vm.namaddr = vm.namaddr.concat(locext);
  vm.rr = vm.namaddr.length;
  //alert(JSON.stringify(vm.namaddr));
  if (vm.namaddr.length < 31 || vm.score > 999) {updatedb(vm.namaddr)} else {alert("Not enough nOS Holding Score to sync all wallets.")}; //update DB
}  

//DIALOG
var ontupd = 1, ontupd0 = 1, clr, namaddr = [], tokens = {}, tokensx = [], wallets = [], trans = [], arrbal = [], arront = [], arrcon = [], 
arrch = [], arrtrans = [], arrcoin = [], arrtok = [], arrid = [], pricebyid = [], neopr = {}, symbolid = {}, ids, arrtx = [], ontrig = 0, pages = 10;
eth_arrcon = [], eth_arrbal = [], eth_arrtx = [];

addwal(0); // for old format namaddr

//if ( nosaddr != '') namaddr.push({'alias':nam, 'address':addr, 'script': decode(addr)});

if (vm.namaddr.length == 0) { vm.rr = '' } else { wallets = [].concat(vm.namaddr); vm.rr = vm.namaddr.length};

//setTimeout(function() {tabwallets(vm.sortt[3]);}, 1000); 
apitok(1);
//setTimeout(onstart, 2000);

function onstart() {
  vm.w = 'waiting...';
  if (ontrig == 1) { setTimeout(onstart, 1000); return};
 
  if (vm.namaddr.length > 0) { vm.status = 0; apibalance(); ontrig = 1} else {vm.status = 80; ontrig = 0; if (vm.statusx == 20) vm.w = '\u2611' }
 
}

//progress bar
 var bar = new RadialProgress(document.getElementById("bar"), { 
  colorBg: "rgba(0,0,0,0.5)", colorFg: "#008B8B", colorText: "#87CEEB", fixedTextSize:0.5, thick: 10, spin: true, animationSpeed: 1, noPercentage: true });


// timer update
timerupd();
function timerupd() {
bar.setText(vm.timer);
bar.setValue((vm.status+vm.statusx)/100);
  --vm.timer;
  if (vm.timer == -1) { 
    onstart(); vm.timer = 15; bar.setValue(0); } 
  setTimeout(timerupd, 1000);
}


// blocks update
blockupd();
setInterval(blockupd, 15000);
async function blockupd() {
  var block, ontblock, ethblock;
  await axios.get('https://api.neoscan.io/api/main_net/v1/get_height').then(function(response) { block = response.data.height }).catch(function(){}); 

  axios.get('https://api.neoscan.io/api/main_net/v1/get_block/'+block).then(function(response) { 
    vm.txs[0] = response.data.tx_count; vm.lastt[0] = moment((moment().unix() - response.data.time)*1000).utc().format('HH:mm:ss');
  let ts = moment().unix() - response.data.time; vm.block[0] = block;
  (ts < 150) ? vm.ala[0] = 'OK': (ts < 600) ? vm.ala[0] = 'DELAY' : vm.ala[0] = 'ALARM';
  }).catch(function(){}); 
//ontology
  await axios.get('https://dappnode1.ont.io:10334/api/v1/block/height').then(function(response) { ontblock = response.data.Result }); 

  axios.get('https://dappnode1.ont.io:10334/api/v1/block/details/height/'+ontblock).then(function(response) {
  vm.txs[1] =  response.data.Result.Transactions.length;  vm.lastt[1] = moment((moment().unix() - response.data.Result.Header.Timestamp)*1000).utc().format('HH:mm:ss');
 let ts = moment().unix() - response.data.Result.Header.Timestamp; vm.block[1] = ontblock;
 (ts < 150) ? vm.ala[1] = 'OK': (ts < 600) ? vm.ala[1] = 'DELAY' : vm.ala[1] = 'ALARM';
  });

//ethereum
  await axios.get('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=DUHD9V7SWAJRE1XPHI8Y3JS414TMRXDAK1').then(function(response) { ethblock = response.data.result }); 

  axios.get('https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag='+ethblock+'&boolean=true&apikey=DUHD9V7SWAJRE1XPHI8Y3JS414TMRXDAK1').then(function(response) {
  vm.txs[2] =  response.data.result.transactions.length;  vm.lastt[2] = moment((moment().unix() - parseInt(response.data.result.timestamp,16))*1000).utc().format('HH:mm:ss');
 let ts = moment().unix() - parseInt(response.data.result.timestamp,16); vm.block[2] = parseInt(ethblock,16);
 (ts < 150) ? vm.ala[2] = 'OK': (ts < 600) ? vm.ala[2] = 'DELAY' : vm.ala[2] = 'ALARM';
  });
 

}


function add() { 

  var dialog = document.querySelector('#adddel');
  dialogPolyfill.registerDialog(dialog);
  dialog.show(); 
  var tex = '';
  for (var txt of vm.namaddr) {
    if (txt.alias != '') {tex = tex + txt.address + ', ' + txt.alias + '; '}
    else {tex = tex + txt.address + '; '}
  }
  vm.text = tex;
}

function intro(x) {
  vm.intr = x; 
  var dialog = document.querySelector('#intro'); 
  dialogPolyfill.registerDialog(dialog);
  dialog.show(); 
}

function close(x) {

try {
var dialog = document.querySelector(x);
  dialog.close()
  if (x == '#adddel') {dialog = document.querySelector('#intro'); dialog.close()}
}catch(e){}
}

function submit() {

try {
  var dialog = document.querySelector('#adddel');
  dialog.close();
  dialog = document.querySelector('#intro');
  dialog.close();
   }catch(e) {}
addwal(1); 
} 


function addwal(x) {
 
  var temp = vm.text; nofa = 0, nofe = 0, nofm = 0;
  namaddr = [];

  pars();

  function pars() {
    var chain = '';
    let inda = temp.search(/[^,.\s\;\:]|A/);
    if (inda == -1) { return };
    temp = temp.substr(inda);
    let indae = temp.search(/[,.\s\;\:]|$/);
    let addr = temp.substr(0, indae); //get address
    temp = temp.substr(indae);
    let indn = temp.search(/[^,.\s]/); 
    let indne = temp.search(/[\:\;]|$/); 
    let nam = temp.substr(indn, (indne-indn)).trim(); //get alias
    temp = temp.substr(indne+1)

    if (addr.substr(0,2) == '0x' && addr.length == 42) {chain = 'ETH'}
    else if (addr.substr(0,1) == 'A' && addr.length == 34) {chain = 'NEOONT'}
    //else if (addr.length < 13) { chain = 'EOS'} 
    else {alert('Incorrect address: ' + addr); pars();	return; }

    //check match
    for (i = 0; i < namaddr.length; i++) {
      if (namaddr[i].address == addr) {
        namaddr[i].alias = nam; 
        ++nofm;
        pars(); return}
    }

     //check NEO addr
    if (chain == 'NEOONT') { 
    for (i = 0; i < addr.length; i++) {
      let c = addr[i];	   
     if (!(c in ALPHABET_MAP)) {
        ++nofe; alert('Incorrect address: ' + addr);
        pars();	return;
      }
    }
    }

     //check ETH addr
     if (chain == 'ETH') {
      for (i = 2; i < addr.length; i++) {
        let c = addr[i];	    
       if (!(c in ALPHABET_ETH)) {
          ++nofe; alert('Incorrect address: ' + addr);
          pars();	return;
        }
      }
      }
/*
      if (chain == 'EOS') { 
        for (i = 0; i < addr.length; i++) {
          let c = addr[i];	    
         if (!(c in ALPHABET_EOS)) {
            ++nofe; alert('Incorrect address: ' + addr);
            pars();	return;
          }
        }
        }

*/

    // add to array
    if (chain == 'NEOONT') {
      namaddr.push({'alias':nam, 'address':addr, 'script': decode(addr), 'chain': chain});
    } else {namaddr.push({'alias':nam, 'address':addr, 'script': '', 'chain': chain});}
    

    ++nofa; pars();
}

vm.namaddr = [].concat(namaddr);

//alert(JSON.stringify(vm.namaddr));

if (vm.login == 1) {
if (vm.namaddr.length < 31 || vm.score > 999) {updatedb(vm.namaddr)} 
else {alert("The nOS score should be at least 1000 to use DataBase updating feature.")}; 
}

let sum = nofa+nofe+nofm;
vm.tokenss = [];
vm.transs = [];
vm.nowwal = '';
vm.txn = ''; vm.tokn = '';
if (sum == 0) { clear(''); vm.walletss = []; vm.sumwal = 0; vm.sumwalx = 0; vm.sumcon = 0; vm.sumch = 0;
 } else {
clear(nofa + " of " + sum );
vm.timer = 15; (x != 0) ? onstart() : {}; 
}
//tabwallets();
//Object.assign(namaddr, vm.walletss );
//alert(JSON.stringify(vm.walletss));
//tabwallets(vm.sortt[3]);
}


function clear(mes) {
vm.rr = mes;
clearTimeout(clr);
clr = setTimeout(function() { if (vm.rr != '') { vm.rr = namaddr.length} }, 10000); 
}


//GET BALANCE and TRANSACTIONS
async function apibalance() {

  var bourl = '', bourlx = [], turlx = [], eth_turlx = [], turl, eth_turl = '', eth_bourl = '', eth_bourlx = [], t = 100, http = ['txlist', 'txlistinternal','tokentx'], eth_arrt = [];
  eth_arrbal = [], eth_arrtx = [];
 //NEOONT
  for (i = 0; i < vm.namaddr.length; i++) { 
   // if (vm.namaddr[i].address != 'AetXb6U1FMcA3zNak8FuPmY33ovi4xj4wg') { //&& xaddra[i] != 'AcemWy1qRBTqmbwFUuhpEcUoyYJRCVfxdE'
     if (vm.namaddr[i].chain == 'NEOONT') {
        bourl = "https://api.neoscan.io/api/main_net/v1/get_balance/" + vm.namaddr[i].address;
        bourlx.push(axios.get(bourl));
        for (var tu = 1; tu < pages+1; ++tu) {
          turl = "https://api.neoscan.io/api/main_net/v1/get_address_abstracts/" + vm.namaddr[i].address + "/" + tu;
          turlx.push(axios.get(turl));
        } 
     //  } 
    } 

    //ethereum
    if (vm.namaddr[i].chain == 'ETH') {
      eth_bourl = 'https://api.ethplorer.io/getAddressInfo/' + vm.namaddr[i].address + '?apiKey=vxgr4977bVmP23';
      eth_bourlx.push(eth_bourl);
      for (var item of http) {
        eth_turl = "https://api.etherscan.io/api?module=account&action=" + item + "&address="+vm.namaddr[i].address+"&page=1&offset=50&sort=desc&apikey=DUHD9V7SWAJRE1XPHI8Y3JS414TMRXDAK1";
        eth_turlx.push(eth_turl);
      }
    }

  }


//neo
  if (bourl != '') {

  if (!(vm.w.match(/!/))) vm.w = 'neo bal';
  await axios.all(bourlx).then(function (response) {	
  arrbal = response; vm.status += 5;
  }).catch(function() { vm.w = '!neobal\u26A0' });

  if (!(vm.w.match(/!/))) vm.w = 'neo txns';
  await axios.all(turlx).then(function (response) {	
    arrtx = response; vm.status += 5;
  }).catch(function() { vm.w = '!neotxns\u26A0' });

 } else {vm.status += 10}
 
//ETHEREUM  TXS & BAL

if (eth_turl != '') {

  var u = -1, j = -1;
  ethtxs();

  async function ethtxs() {
    ++u;
     if (u == eth_turlx.length) { if (!(vm.w.match(/!/))) {vm.status += 10}; ethconcat(); return} 
     if (!(vm.w.match(/!/))) vm.w = 'eth txs ' + (u+1);
      await axios.get(eth_turlx[u]).then(function (response) {	
      eth_arrt.push(response) }).catch(function() { eth_arrt.push(''); vm.w = '!ethtxs\u26A0'; });
      setTimeout(ethtxs, 30);
  }
   
  
  function ethconcat() {
  for (i = 0; i < eth_arrt.length; i = i + 3) { //alert(JSON.stringify(eth_arrt[i]));
    if (eth_arrt[i].data.result != undefined) {
       eth_arrtx.push(eth_arrt[i].data.result.concat(eth_arrt[i+1].data.result, eth_arrt[i+2].data.result))
    } else {eth_arrtx.push('')}
  }
  
  ethbal()
  }
  //alert(JSON.stringify(eth_arrtx));

 async function ethbal() {
      ++j; 
      if (j == eth_bourlx.length) { if (!(vm.w.match(/!/))) {vm.status += 10}; apicontin(); return }
      if (!(vm.w.match(/!/))) vm.w = 'eth bal ' + (j+1);
      await axios.get(eth_bourlx[j]).then(function (response) {	
      eth_arrbal.push(response); 
      setTimeout(ethbal, t);
      }).catch(function(e) { eth_arrbal.push(''); vm.w = '!ethbal\u26A0'; setTimeout(ethbal, t); });
  }


 } else { vm.status += 20; apicontin() }



function apicontin() {
 // alert(JSON.stringify(eth_arrbal));
// symbolid create
  try{
    for (var ar of arrid) { 
      var str1 = (ar.name).toLowerCase(), str3;

      //alert(JSON.stringify(arrbal));
      for (var arr of arrbal) {
        for (var na of arr.data.balance) {
         str3 = na.asset.toLowerCase();
        if (str1 == str3 ) {
          symbolid[na.asset_symbol] = ar.id; 
        }
        }
      }
      //ontology
    
      //for (var arrr of arront) {
       // for (var naa of arrr.data.Result.AssetBalance) { 
         // var str4 = naa.AssetName.toLowerCase();
         // if ( str1 == str4 ) { symbolid[naa.AssetName.toUpperCase()] = ar.id; }
        //}
      //}

    //ethereum
    for (var arr of eth_arrbal) {
      for (var na of arr.data.tokens) {
       str3 = na.tokenInfo.name.toLowerCase(); 
      if (str1 == str3 ) {
        symbolid[na.tokenInfo.symbol] = ar.id; 
      }
      }
    }
  
    }
  } catch(e){};

  
//alert(JSON.stringify(symbolid));
ids = '';
for (var u in symbolid) {
   ids = ids  + ',' + symbolid[u];
 }
  //alert(JSON.stringify(arront));
  prtok()
}

}


// GET PRICE TOKEN
async function prtok() { 
  if (!(vm.w.match(/!/))) vm.w = 'prices';
   axios.get("https://api.coingecko.com/api/v3/simple/price?ids=" + ids + "&vs_currencies=usd").then(function(response) { 
    pricebyid = response.data; vm.status += 10; if (ontrig == 0) tabtokens() }).catch(function(e) { vm.w = '!prices\u26A0'; });
   
  await axios.get('https://api.switcheo.network/v2/tickers/last_price?bases=NEO,ETH').then(function(response) {
    neopr = response.data; vm.status += 10;  }).catch(function(e) {vm.w = '!pricesx\u26A0' });
   if (!(vm.w.match(/!/))) vm.w = '';
   apicontract()
}



// GET CONTRACT BALANCE
async function apicontract() {
var courl, courlx = [], chest1, chest2, chestx = [], eth_courl, eth_courlx = [];
try {
  for (var ad of vm.namaddr) { //if (ad.address == '') {alert(ad.script)};
    //neo ont
   if (ad.chain == 'NEOONT') {
        courl = "https://api.switcheo.network/v2/balances?addresses=" + ad.script + "&contract_hashes=a32bcf5d7082f740a4007b16e812cf66a457c3d4";
        courlx.push(axios.get(courl)); 

        chest1 = 'https://api.switcheo.network/v2/lockups/history?lockup_type=1&blockchain=neo&address='+ ad.script + '&contract_hash=a32bcf5d7082f740a4007b16e812cf66a457c3d4&asset_id=ab38352559b8b203bde5fddfa0b07d8b2525e132';
        chest2 = 'https://api.switcheo.network/v2/lockups/history?lockup_type=2&blockchain=neo&address='+ ad.script + '&contract_hash=a32bcf5d7082f740a4007b16e812cf66a457c3d4&asset_id=ab38352559b8b203bde5fddfa0b07d8b2525e132';
        
        chestx.push(axios.get(chest1)); chestx.push(axios.get(chest2)); 
    }
//ethereum
    if (ad.chain == 'ETH') {
      eth_courl = "https://api.switcheo.network/v2/balances?addresses=" + ad.address + "&contract_hashes=0xba3ed686cc32ffa8664628b1e96d8022e40543de";
      eth_courlx.push(axios.get(eth_courl)); 
    }
  }
  }catch(e){};

  if (!(vm.w.match(/!/))) vm.w = 'neo cont';
  await axios.all(courlx).then(function (response) {	
    arrcon = response;  vm.status += 5; 
    }).catch(function() { vm.w = '!neocont\u26A0';});
  await axios.all(chestx).then(function (response) {	
    arrch = response;  vm.status += 10;
    }).catch(function() { vm.w = '!chest\u26A0';});

  //ethereum
  if (!(vm.w.match(/!/))) vm.w = 'eth cont';
  await axios.all(eth_courlx).then(function (response) {	
    eth_arrcon = response;  vm.status += 5; 
    }).catch(function(e) { vm.w = '!ethcont\u26A0';});

    ontupdate();
 
}



// GET TOKENS INFO
async function apitok(trig) {
  vm.statusx = 0; 
  if (!(vm.w.match(/!/))) vm.w = 'tokens';
  await axios.get("https://api.switcheo.network/v2/exchange/tokens?show_inactive=1").then(function(response) {	  
	arrtok = response.data; vm.statusx += 10;
	//arrtok.SWH = {"hash":"78e6d16b914fe15bc16150aeb11d0c2a8e532bdd","decimals":8};	 //add SWH old token
	//arrtok.ONT = {"hash":"ceab719b8baa2310f232ee0d277c061704541cfb","decimals":8};	 //add ONT nep-5 token
  }).catch(function(e) { setTimeout(apitok, 15000, 0); vm.w = '!tokens\u26A0';});

  if (!(vm.w.match(/!/))) vm.w = 'coins';
  await axios.get("https://api.coingecko.com/api/v3/coins/list").then(function(response) {	  
  arrid = response.data; vm.statusx += 10;

  try {
    for (var ar of arrid) { 
      var str1 = (ar.name).toLowerCase();

      for (var sy in arrtok) { 
        var str2 = arrtok[sy].name.toLowerCase();
        if (str1 == str2 && (arrtok[sy].type == 'NEO' || arrtok[sy].type.substr(0,3) == 'NEP')) {
          symbolid[sy] = ar.id; 
        }
      }
    } 
  } catch(e){};

  }).catch(function(e) { vm.w = '!coins\u26A0'; setTimeout(apitok, 15000, 0); });

  

  
if (trig == 1) { 
    ////////////manual tokens///////////////
  symbolid = Object.assign({'SWTH':'switcheo', 'OBT':'orbis-token', 'ASA':'asura', 'NEX':'neon-exchange',
  'LRN':'loopring-neo', 'FTX':'ftw', 'CPX':'apex', 'PKC':'pikciochain', 'RHT':'hashpuppy-token', 'QLC':'qlink', 'THOR':'thor-token', 'SPOT':'spotcoin',
  'NKN':'nkn', 'MCT':'master-contract-token', 'TNC':'trinity-network-credit', 'TMN':'ttanslateme-network-token', 'ONT':'ontology', 'ONG':'ong', 'EDS':'endorsit', 
  'GTA':'gagapay-network', 'ETH':'ethereum', 'OPENC':'open-platform', 'LEO':'leo-token', 'VIBE':'vibe', 'AGI':'singularitynet'  }, symbolid);
  onstart() 
};

}




async function ontupdate() {
  
  var ontacc, onturlx = [], ontbalx = [], ontba = '';
  for (i = 0; i < vm.namaddr.length; i++) { 

    if (vm.namaddr[i].chain == 'NEOONT') {
        ontba = "https://dappnode1.ont.io:10334/api/v1/balance/" + vm.namaddr[i].address;
        ontbalx.push(axios.get(ontba)); 
        ontacc = "https://explorer.ont.io/api/v1/explorer/address/"+ vm.namaddr[i].address +"/20/1";
        onturlx.push(axios.get(ontacc)); 
    }
  }
    if (ontba == '') {vm.status += 10; tabtokens(); return}

    if (!(vm.w.match(/!/))) vm.w = 'ont bal';
    if (ontupd0 == 1 ) {ontupd0 = 0; 
     axios.all(ontbalx).then(function (response) {	
        arrontb = response; vm.status += 5; ontupd0 = 1; tabtokens();
    }).catch(function() { vm.w = '!ontbal\u26A0'; ontupd0 = 1});
  }
 
  if (!(vm.w.match(/!/))) vm.w = 'ont txns';
  if (ontupd == 1 ) {ontupd = 0; 
    axios.all(onturlx).then(function (response) {	
    arront = response; vm.status += 5; ontupd = 1; tabtokens();
  }).catch(function() { vm.w = '!onttxns\u26A0'; ontupd = 1});
  }

tabtokens();
}



//CREATE TOKENS TABLE
async function tabtokens() {
  ontrig = 0;
 // if (moment().utc().unix() > 1559347200) {alert('testing period is finished');return};
  
  var  sumwal = 0, sumcon = 0, sumch = 0, i = -1, ii = -1;

  wallets = [].concat(vm.namaddr);

  tokens = {}; trans = []; tokensx = [];

  for (j = 0; j < vm.namaddr.length; j++) { 

    var eth_alltok = ['ETH'], alltok = [], bal = [], ball = {}, ontbal = [], ontb = '', oaddr = vm.namaddr[j].address, otok = [], totbal = 0, totcon = 0, totch = 0, totchest = 0;
    
    //NEO
  
 if (vm.namaddr[j].chain == 'NEOONT' || vm.namaddr[j].chain == undefined) {++i; 
      //get all tokens from balance
      bal = arrbal[i].data.balance; 
      for (var ti of bal) {
          (alltok.indexOf(ti.asset_symbol) == -1) ? alltok.push(ti.asset_symbol) : {};
        }
 
        for (var k = 0, arrays = [arrcon[i].data.locked, arrcon[i].data.confirmed]; k < arrays.length; k++){
          for (key in arrays[k]){
            if(ball[key] == undefined){
              ball[key] = arrays[k][key];
            }else{
              ball[key] = parseFloat(ball[key]) + parseFloat(arrays[k][key]);
            };
          };
        };
  
        for (var tj in ball) {
        (alltok.indexOf(tj) == -1) ? alltok.push(tj) : {};
        }

        //ontology get tokens
        try { ontb = arrontb[i].data.Result; 
         for (var tk in ontb) {
          (alltok.indexOf(tk.toUpperCase()) == -1) ? alltok.push(tk.toUpperCase()) : {};
          }
        } catch(e){};

        try {
        ontbal = arront[i].data.Result.AssetBalance;
        for (var to of ontbal) {
          (alltok.indexOf(to.AssetName.toUpperCase()) == -1 && to.AssetName != 'waitboundong' && to.AssetName != 'unboundong') ? alltok.push(to.AssetName.toUpperCase()) : {};
          }
         }catch(e){}

    // get value contr and bal and chest
       
      for (var sym of alltok) {
    
        var ochest1 = 0; ochest2 = 0, ousdch1 = 0, ousdch2 = 0, datch1 = '', datch2 = '', oprice = '', ocontr = '', obal = '', ousd = '', ousdc = 0, otot = 0;
        
        for (var tii of bal) {
          if (sym == tii.asset_symbol) { 
            if (tii.amount < 0 ) {obal = 0; }
            else {obal = tii.amount; }
            break;
          };
        }
       
        for (var tjj in ball) {
          if (sym == tjj) { ocontr = ball[tjj]*Math.pow(10, -arrtok[sym].decimals); break;  };
          }

        //ontology
       
          if ((sym == 'ONT' || sym == 'ONG') && ontb != '') {
            (sym == 'ONT') ? obal = ontb['ont'] : obal = ontb['ong']*1e-9;
          } else {
            for (var too of ontbal) {
            if (sym == too.AssetName.toUpperCase()) {obal = too.Balance; break;}
            }
          }

        // calculate
         try{
        if (symbolid[sym] == undefined) { 
         
           if ( arrtok[sym].trading_active == true ) {
            oprice = neopr[sym].NEO*pricebyid['neo'].usd; 
            } else {oprice = ''}
      
              
          } else { oprice = pricebyid[symbolid[sym]].usd;}//price
    }catch(e) {oprice = ''}
          //calculate chest SWTH
          if (sym == 'SWTH') {
            //ochest1 = 0; ochest2 = 0;
          for (var ch1 of arrch[i*2].data) {
            (ch1.status == 'locked') ? ochest1 += ch1.amount*1e-8 : {}
          }
          for (var ch2 of arrch[i*2+1].data) {
            (ch2.status == 'locked') ? ochest2 += ch2.amount*1e-8 : {}
          }
            totchest = ochest1+ochest2;
            ousdch1 = ochest1*oprice;
            ousdch2 = ochest2*oprice;
            totch += ousdch1+ousdch2;
            (arrch[i*2].data.length > 0) ? datch1 = arrch[i*2].data[0].created_at.substr(0,10) : {};
            (arrch[i*2+1].data.length > 0) ? datch2 = arrch[i*2+1].data[0].created_at.substr(0,10) : {};
            
        }

        
        otot = obal+ocontr//+ochest1+ochest2;
        ousd = otot*oprice;
        ousdc = ocontr*oprice;
        totcon += ousdc;
        totbal += (ousd-ousdc);//wallet balance
        // (oprice > 1 ) ? oprice = '$' + oprice.toLocaleString('en-EN', {maximumFractionDigits:2 }) : (oprice > 0) ? oprice = '$' + Math.round(oprice*1e6)/1e6 : {};
        (ocontr > 1) ? ocontr = Math.round(ocontr*10)/10 : (ocontr > 0) ? ocontr = Math.round(ocontr*1e6)/1e6 : ocontr = 0;
        (obal > 1) ? obal = Math.round(obal*10)/10 : (obal > 0) ? obal = Math.round(obal*1e6)/1e6 : obal = 0;
        (otot > 1) ? otot = Math.round(otot*10)/10 : (otot > 0) ? otot = Math.round(otot*1e6)/1e6 : {};
        //(ousd > 0 ) ? ousd = '$' + ousd.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) :  ousd = '';
         //add token
         //if (oaddr == vm.nosad && sym == 'NOS') vm.nosbal = obal+ocontr;
        if (otot > 0) {
            otok.push({'symbol': sym, 'price': oprice, 'chest1': ochest1, 'chest2': ochest2, 'contract': ocontr, 'total': obal, 'usdc': ousdc, 'usd': ousd, 'usdch1': ousdch1, 'usdch2': ousdch2, 'date1':datch1, 'date2':datch2}); 
            tokensx.push({'symbol': sym, 'price': oprice, 'chest1': ochest1, 'chest2': ochest2, 'contract': ocontr, 'total': obal, 'usdc': ousdc, 'usd': ousd, 'usdch1': ousdch1, 'usdch2': ousdch2, 'date1':datch1, 'date2':datch2});
          }
      }
    } 

    //ETHEREUM TOKENS BALANCE

    if (vm.namaddr[j].chain == 'ETH') {++ii; 
      
      //get all tokens from balance
      bal = eth_arrbal[ii].data.tokens; 
      for (var ti of bal) {
          (eth_alltok.indexOf(ti.tokenInfo.symbol) == -1) ? eth_alltok.push(ti.tokenInfo.symbol) : {};
        }
 
        for (var k = 0, arrays = [eth_arrcon[ii].data.locked, eth_arrcon[ii].data.confirmed]; k < arrays.length; k++){
          for (key in arrays[k]){
            if(ball[key] == undefined){
              ball[key] = arrays[k][key];
            }else{
              ball[key] = parseFloat(ball[key]) + parseFloat(arrays[k][key]);
            };
          };
        };
  
        for (var tj in ball) {
        (eth_alltok.indexOf(tj) == -1) ? eth_alltok.push(tj) : {};
        }

      
    // get value contr and bal and chest
       
      for (var sym of eth_alltok) {
    
        var ochest1 = 0; ochest2 = 0, ousdch1 = 0, ousdch2 = 0, datch1 = '', datch2 = '', oprice = '', ocontr = '', obal = '', ousd = '', ousdc = 0, otot = 0;
        
        for (var tii of bal) {
          if (sym == 'ETH') {obal = eth_arrbal[ii].data.ETH.balance; break}
          if (sym == tii.tokenInfo.symbol) { obal = tii.balance/10**(tii.tokenInfo.decimals); break}
        }
       
        for (var tjj in ball) {
          if (sym == tjj) { ocontr = ball[tjj]*Math.pow(10, -arrtok[sym].decimals); break }
          }
          
            try{
        // calculate
        if (symbolid[sym] == undefined) { 
      
           if ( arrtok[sym].trading_active == true ) {
            oprice = neopr[sym].ETH*pricebyid['eth'].usd; 
            } else {oprice = ''}
      
              
          } else { oprice = pricebyid[symbolid[sym]].usd;}//price

    }catch(e) {oprice = ''}
        
        otot = obal+ocontr//+ochest1+ochest2;
        ousd = otot*oprice;
        ousdc = ocontr*oprice;
        totcon += ousdc;
        totbal += (ousd-ousdc);//wallet balance
        // (oprice > 1 ) ? oprice = '$' + oprice.toLocaleString('en-EN', {maximumFractionDigits:2 }) : (oprice > 0) ? oprice = '$' + Math.round(oprice*1e6)/1e6 : {};
        (ocontr > 1) ? ocontr = Math.round(ocontr*10)/10 : (ocontr > 0) ? ocontr = Math.round(ocontr*1e6)/1e6 : ocontr = 0;
        (obal > 1) ? obal = Math.round(obal*10)/10 : (obal > 0) ? obal = Math.round(obal*1e6)/1e6 : obal = 0;
        (otot > 1) ? otot = Math.round(otot*10)/10 : (otot > 0) ? otot = Math.round(otot*1e6)/1e6 : {};
        //(ousd > 0 ) ? ousd = '$' + ousd.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) :  ousd = '';
         //add token
         //if (oaddr == vm.nosad && sym == 'NOS') vm.nosbal = obal+ocontr;
        if (otot > 0) {
            otok.push({'symbol': sym, 'price': oprice, 'chest1': ochest1, 'chest2': ochest2, 'contract': ocontr, 'total': obal, 'usdc': ousdc, 'usd': ousd, 'usdch1': ousdch1, 'usdch2': ousdch2, 'date1':datch1, 'date2':datch2}); 
            tokensx.push({'symbol': sym, 'price': oprice, 'chest1': ochest1, 'chest2': ochest2, 'contract': ocontr, 'total': obal, 'usdc': ousdc, 'usd': ousd, 'usdch1': ousdch1, 'usdch2': ousdch2, 'date1':datch1, 'date2':datch2});
          }
      }
    } 






      // create tokens array

      tokens[oaddr] = otok; 
      sumwal += totbal;// sum all wallets
      sumcon += totcon;
      sumch += totch;
     // (totbal > 0 ) ?  xtotbal = '$' + totbal.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) : xtotbal = '';
     // (totcon > 0 ) ?  xtotcon = '$' + totcon.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) : xtotcon = '';
      wallets[j].usd = totbal; // insert balance for wallet
      wallets[j].usdc = totcon; // contract balance;
      wallets[j].usdch = totch;
      wallets[j].chest = totchest;
      wallets[j].total = totbal + totcon + totch;
      wallets[j].chain = vm.namaddr[j].chain;
     
        // create tx table
      var txam = '', txda = '', txad = '', txsi, txto = '', txs = [], txurl = '', lasttx = 0, ntx = 0;
      
    if (vm.namaddr[j].chain == 'NEOONT' || vm.namaddr[j].chain == undefined) {

      for (var p = 0; (p < arrtx[i*pages].data.total_pages && p < pages); ++p) {
    
      for (var itx of arrtx[i*pages+p].data.entries) {
        txam = itx.amount;
        txda = itx.time;
        if (lasttx == 0) { wallets[j].date = txda; lasttx = 1;};
        txurl = "https://neoscan.io/transaction/"+itx.txid;
        //if (txam == 0) {txsi = '<<<<<>>>>>'; txam = ''; txad = itx.address_from;} 
        if (itx.address_to == oaddr) {txad = itx.address_from; txsi = '<<<<<<<<<<'} else {txsi = '>>>>>>>>>>'; txad = itx.address_to}
        if (txad == 'AbArunq3PGYmQv4xhduTKva7r2ppUqeaDi') {txad = 'Switcheo Exchange V3'}
        if (txad == 'AKJQMHma9MA8KK5M8iQg8ASeg3KZLsjwvB') {txad = 'Switcheo Exchange V2'}
       
       
        //search symbol by hash
        for (co in arrtok) {
          if (arrtok[co].hash == itx.asset) {txto = arrtok[co].symbol; break } 
        }
        for (var ba of arrbal) {
            for (var b of ba.data.balance) {
            if (b.asset_hash == itx.asset) { txto = b.asset_symbol; break }
            }
        }

        //var tokhash = {'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b':'NEO'}
        //if (tokhash[itx.asset] != undefined) { txtok = tokhash[itx.asset] }
         
          txs.push({'amount':txam, 'symbol':txto, 'date':txda, 'side':txsi, 'address':txad, 'url': txurl}); 
        
      }
     
    }

    //ontology
    lasttx = 0;
    try {
    for (var otx of arront[i].data.Result.TxnList) {
      if (otx.ConfirmFlag == 1) { ++ntx;
        txam = otx.TransferList[0].Amount;
        txto = otx.TransferList[0].AssetName.toUpperCase();
        txda = otx.TxnTime;
        if ((wallets[i].date < txda && lasttx == 0) || wallets[i].date == undefined ) { wallets[i].date = txda; lasttx = 1;}
        if (otx.TransferList[0].ToAddress == oaddr) {txad = otx.TransferList[0].FromAddress; txsi = '<<<<<<<<<<'} else {txsi = '>>>>>>>>>>'; txad = otx.TransferList[0].ToAddress}
        txurl = 'https://explorer.ont.io/transaction/' + otx.TxnHash;
        if (otx.TransferList[0].ToAddress != otx.TransferList[0].FromAddress) {txs.push({'amount':txam, 'symbol':txto, 'date':txda, 'side':txsi, 'address':txad, 'url': txurl});}
      }    
    }
  
    } catch(e) {};
    try {
      txs[0]['entries'] = arrtx[i*pages].data.total_entries + ntx;
    }catch(e){}

  }//end neoont

  //ETHEREUM TXNS
    
  if (vm.namaddr[j].chain == 'ETH') {
try { 
      var dec, eth_a = eth_arrtx[ii].sort(function (a, b) { return b.timeStamp - a.timeStamp }), txns = 0;
      for (var itx of eth_a) {  
        if (itx.tokenSymbol == undefined) {txto = 'ETH'; dec = 18}
        else { dec = itx.tokenDecimal; txto = itx.tokenSymbol}
        txam = itx.value/10**dec;
        txda = itx.timeStamp; 
        if (lasttx == 0) { wallets[j].date = txda; lasttx = 1;};
        txurl = "https://etherscan.io/tx/"+itx.hash;
       
        if (itx.to == oaddr) {txad = itx.from; txsi = '<<<<<<<<<<'} else {txsi = '>>>>>>>>>>'; txad = itx.to}
        if (txad == '0xba3ed686cc32ffa8664628b1e96d8022e40543de') {txad = 'Switcheo Exchange'}
       
          txs.push({'amount':txam, 'symbol':txto, 'date':txda, 'side':txsi, 'address':txad, 'url': txurl}); 
          if (txam != 0) ++txns;
      }
     
      txs[0]['entries'] = txns; 
     
    } catch(e) {}
  }

  trans[oaddr] = txs; 

  }


    vm.sumwal = sumwal;
    vm.sumcon = sumcon;
    vm.sumch = sumch;
    vm.sumwalx = sumwal+sumcon+sumch;
if (vm.namaddr.length == 1)  vm.nowwal = vm.namaddr[0].address; 

tabwallets(vm.sortt[3]);
listtok(vm.sortt[1]);
listtx();

(vm.status+vm.statusx == 100) ? vm.w = '100%\u2611' : vm.w = vm.status+vm.statusx +'%';

}

//LIST TOKENS
function listtok(t) {

  var tempa = [];
  vm.sortt[1] = t; 

 //alert(moment("", 'YYYY-M-D').unix());

  if (vm.com == true) {
    for (var j = 0; j < tokensx.length; ++j) {
      for (var k = j+1; k < tokensx.length; ++k) {
        if (tokensx[j].symbol == tokensx[k].symbol) {

          tokensx[j].chest1 += tokensx[k].chest1;
          tokensx[j].chest2 += tokensx[k].chest2;
          tokensx[j].contract += tokensx[k].contract; 
          tokensx[j].total += tokensx[k].total;
          tokensx[j].usdc += tokensx[k].usdc; 
          tokensx[j].usd += tokensx[k].usd;
          tokensx[j].usdch1 += tokensx[k].usdch1;
          tokensx[j].usdch2 += tokensx[k].usdch2; 
          //tokensx[j].date1 = tokensx[k].date1;
          //tokensx[j].date2 = tokensx[k].date2
              
              if (tokensx[k].date1 !='' && tokensx[j].date1 =='') {tokensx[j].date1 = tokensx[k].date1};
              if (tokensx[k].date1 !='' && tokensx[j].date1 !='' && moment(tokensx[k].date1, 'YYYY-M-D').unix() >= moment(tokensx[j].date1, 'YYYY-M-D').unix()) {
              tokensx[j].date1 = tokensx[k].date1 };

              if (tokensx[k].date2 !='' && tokensx[j].date2 =='') {tokensx[j].date2 = tokensx[k].date2};
              if (tokensx[k].date2 !='' && tokensx[j].date2 !='' && moment(tokensx[k].date2, 'YYYY-M-D').unix() >= moment(tokensx[j].date2, 'YYYY-M-D').unix()) {
              tokensx[j].date2 = tokensx[k].date2 };

          tokensx.splice(k,1);  
          
        } 
      }
    }
    tempa = [].concat(tokensx);
  } else { 
    if (vm.nowwal != '') {tempa = [].concat(tokens[vm.nowwal]) }
  }

  (vm.sortt[0] == 'T') ? vm.tokenss = tempa.sort(function (a, b) { if (b.symbol > a.symbol) {return t} else {return -t} })  :
  (vm.sortt[0] == 'P') ? vm.tokenss = tempa.sort(function (a, b) { return b.price*t - a.price*t }) : 
  (vm.sortt[0] == 'C') ? vm.tokenss = tempa.sort(function (a, b) { return b.contract*t - a.contract*t }) : 
  (vm.sortt[0] == 'W') ? vm.tokenss = tempa.sort(function (a, b) { return b.total*t - a.total*t }) : 
  (vm.sortt[0] == 'U') ? vm.tokenss = tempa.sort(function (a, b) { return (b.usd + b.usdch1 + b.usdch2)*t - (a.usd + a.usdch1 + a.usdch2)*t }) : {};
  
  try { 
  vm.tokn = tempa.length;
  } catch(e) {vm.tokn = '';}

}



//CREATE TX TAB
function listtx() {
  try { 
  vm.transs = trans[vm.nowwal].sort(function (a, b) { return b.date - a.date });
} catch(e) {}
   try { 
  vm.txn = trans[vm.nowwal][0].entries;
  } catch(e) { vm.txn = '';}
}

//CREATE WALLETS TABLE
function tabwallets(w) {
 vm.sortt[3] = w;
  try {
   var temp = [].concat(wallets);
  (vm.sortt[2] == 'A') ? vm.walletss = temp.sort(function (a, b) { if (b.alias > a.alias) {return w} else {return -w} }) :
  (vm.sortt[2] == 'D') ? vm.walletss = temp.sort(function (a, b) { return b.date*w - a.date*w }) : 
  (vm.sortt[2] == 'CH') ? vm.walletss = temp.sort(function (a, b) { return b.usdch*w - a.usdch*w }) : 
  (vm.sortt[2] == 'C') ? vm.walletss = temp.sort(function (a, b) { return b.usdc*w - a.usdc*w }) : 
  (vm.sortt[2] == 'W') ? vm.walletss = temp.sort(function (a, b) { return b.usd*w - a.usd*w }) : 
  (vm.sortt[2] == 'S') ? vm.walletss = temp.sort(function (a, b) { return (b.usd+b.usdc+b.usdch)*w - (a.usd+a.usdc+a.usdch)*w }) : vm.walletss = temp;
  } catch(e) { vm.walletss = temp };
 
}

  
