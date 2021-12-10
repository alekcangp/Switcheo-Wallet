<?php

session_start();


/**
 * Common variables.
 */
$redirect_uri = "https://switcheowallet.tech";
$client_id = "57f446ec7c317ab0baca37532d502548";

// NEVER share your client secret. This is like the password of your application.
$client_secret = "270b094ab5f778dcedfab82099841c3724e3af5823401215c140ccbfadfe843d";

//$_SESSION['logout'] = $_GET['logout'];
//if ( $_SESSION['logout'] == true ) { $_SESSION['access_token'] = '';}


/**
 * The code below is used if the user is not yet authorized.
 */
if (empty($_GET['code']) && empty($_SESSION['access_token'])) {
    //  Generate a random "state" variable to verify the user's session
    $state = bin2hex(random_bytes(4));
    $_SESSION['state'] = $state;

    /*
     * Create the nOS ID Authorization URL. You can find the generated URL in your nOS ID App page.
     * We replaced the state value "example" with our randomly generated $state.
     */
    $url = "'https://nos.app/oauth/authorize?client_id=$client_id&redirect_uri=$redirect_uri&state=$state'";
    // $content is what we render in the body.
    $button = "";//<a href = $url><img title = 'nOS login' src = './img/nos.png' style = 'width: 30px; height: 30px; vertical-align: middle; padding-bottom: 2px'/></a>";
} else {
    $url = "https://switcheowallet.tech";
    $button = "<img title = 'nOS logout' onclick = 'logout()' src = './img/nos.gif' style = 'width: 30px; height: 30px; vertical-align: middle; padding-bottom: 2px'/>";
}

/**
 * The code below is used if the user authorized the authorization prompt.
 */
if (!empty($_GET['code']) && !empty($_SESSION['state']) && $_SESSION['state'] === $_GET['state']) {
    // Set post fields
    $post = [
        'code' => $_GET['code'],
        'grant_type' => 'authorization_code',
        'redirect_uri' => $redirect_uri,
        'client_id' => $client_id,
        'client_secret' => $client_secret
    ];

    $ch = curl_init('https://nos.app/oauth/token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);

    $response = curl_exec($ch);

    curl_close($ch);

    $response = json_decode($response);

    /*
     * Store the access token in the user's browser session to authorize the user and make API requests.
     * IMPORTANT: In production, you want to store the access token in a database and use a separate session token (stored as a cookie) to authorize the user.
     * If you're building an app with existing account management, you could store the access token in a separate column for the logged in user. As long as the access token can be retrieved for a logged in user later.
     * Read the OAuth 2 docs for best practices: https://www.oauth.com/oauth2-servers/accessing-data/
     */
    $_SESSION['access_token'] = $response->access_token;

    // Refresh or redirect the page.
    header("Location: https://switcheowallet.tech");
} elseif (!empty($_SESSION['state']) && !empty($_GET['state']) && $_SESSION['state'] !== $_GET['state']) {
    // If state is set in the URL but doesn't match user session: something went wrong. Refresh the page.
    header("Location: https://switcheowallet.tech");
}



/**
 * The code below is used to display the nOS.app user account data for an authorized user.
 */
if (!empty($_SESSION['access_token'])) {
    $access_token = $_SESSION['access_token'];

    //Create URL for making an API request to nos.app to retrieve user data, using our App credentials (client_id and client_secret) and the user's access token.
    $response = file_get_contents("https://nos.app/api/v1/user/info?access_token=$access_token");
    $response = json_decode($response);

    // Process the user data. You can read basic account data + the user's connected crypto addresses.
    $address = $response->address->neo[0];
   
    $username = $response->username;
   
    $email =  $response->email;
   
    $score = $response->holding_score;

$servername = "localhost";
$uname = "u118820896_wallets";
$password = "Darina57";
$dbname = "u118820896_wallets";

// Create connection
$conn = new mysqli($servername, $uname, $password, $dbname);
// Check connection
if ($conn->connect_error) {
   // die("Connection failed: " . $conn->connect_error);
} 


$sql = "SELECT addresses FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    $row = $result->fetch_assoc();
    $arrayx = $row["addresses"];
    if ($arrayx == '') {$arrayx = "[]";}
    
} else {  $arrayx = "[]"; 

  $sql = "INSERT INTO users (token, username, addresses)
VALUES ('$access_token', '$username', '$arrayx')";

if ($conn->query($sql) === TRUE) {
  //  echo "New record created successfully";
} else {
  //  echo "Error: " . $sql . "<br>" . $conn->error;
}
 
}

$conn->close();
   
} 

?>

<!DOCTYPE html>
<html lang="en">
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<script>
  <!--[if !IE]>
  alert("Internet Explorer is not supported! Chrome, Firefox, Opera and Edge are supported browsers.")
    <![endif]-->   
</script>
<meta name="viewport" content="target-densitydpi=device-dpi">
<meta name="description" content="Possibly, this is the first parallel wallets explorer in real time. Easy way to get details of all wallets in one place. Supports Ethereum, NEO, Ontology and Switcheo Exchange."/>
<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym");

   ym(53132908, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/53132908" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->

<!-- Hotjar Tracking Code for https://switcheowallet.tech 
  <script>
  (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:1294194,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
-->
<script src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js" async></script>
<script src = "https://cdnjs.cloudflare.com/ajax/libs/vue/2.2.6/vue.min.js"></script>
<script src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js" async></script>
<script src = "https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0-beta.1/axios.js"></script>
<script src = "https://code.jquery.com/jquery-1.7.1.min.js" type="text/javascript"></script>
<script src = "./src/radialprogress.js"></script>
<script src = "./src/dialog.js" ></script>
<script src = "./src/hash.js" ></script>

<link rel="icon" type="image/gif" href="./img/favicon.gif" size = "any" >
<link href = "./css/wallets.css" type="text/css" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css?family=Pathway+Gothic+One" rel="stylesheet">

<title>EXPLORER</title>

</head><body>

<canvas id="pixie"></canvas>

<div id = "vmwal" v-cloak>
<div id = 'content'>
  <dialog id = "adddel">
      
      <b>W A L L E T S &nbsp;&nbsp; E D I T O R<br></b>
      <textarea  placeholder="Enter Ethereum, NEO or Ontology addresses separated by semicolon" v-model.trim = "text" ></textarea><br>
      <div style="width:30px; position: absolute; left: 5px; bottom: 5px; font-size: 15px;" v-on:click = "intro('t')" class="button">TRACK</div>
      <div style="width:70px;" v-on:click = "submit()" class="button">&#10003;</div>
      <div style="width:70px;" class="button"><?= $button ?></div>
      <div style="width:70px;" v-on:click = "close('#adddel')" class="button">&#10007;</div>
      <div style="width:30px; position: absolute; right: 0px; bottom: 5px; font-size: 20px;" v-on:click = "intro('?')" class="button">&#63;</div>
  </dialog>

  <dialog id = "intro">
    <div v-if = "intr == '?'">
      <div style="width:30px; position: absolute; right: 0px; top: 0px; font-size: 15px;" v-on:click = "close('#intro')" class="button">&#10007;</div>
      <div  style="font-size: 17px; margin-top:15px">Example: <u>AbJ5QcxbXRYWjw2ATuGuYvGA3AAcy4XePg</u>, <u>Wallet 1</u>; 
        <div style = 'margin-top: -5px; margin-left: 270px'> &#8593;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8593;</div>
        <div style = 'margin-top: -18px; margin-left: 114px; '>NEO or ONT address &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;alias</div>
        <div style = 'margin-top: -3px; margin-left: 268px; font-size: 13px'>comma &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; semicolon</div>
       <!-- <div style = 'font-size: 17px'>Use nOS ID authorization to keep the wallets in sync across devices<br>(required at least 1000 Holding Score to sync more 30 wallets)</div>-->
        <a href = "https://t.me/SwitcheoSmartExplorer" target = "_blank" style = "outline: none;"><img title = "Telegram Chanel" style = "width: 30px; height: 30px; margin-top: 10px" src = '/img/tg.png'/></a>
      </div>
    </div>
    <div v-else >
      <div style="width:30px; position: absolute; left: 0px; top: 0px; font-size: 15px;" v-on:click = "close('#intro')" class="button">&#10007;</div>
      <div style = 'font-size: 20px; margin-top:40px'>Use <a style = "color:skyblue" target = "_blank" href = "https://t.me/SwitcheoMonitorBot">The SwitcheoMonitorBot</a> to track NEO and ETH wallets and monitor NEO network perfomance.</div>
      <a href = "https://t.me/SwitcheoSmartExplorer" target = "_blank" style = "outline: none;"><img title = "Telegram Chanel" style = "width: 30px; height: 30px; margin-top: 25px" src = '/img/tg.png'/></a>
    </div>
  </dialog>


<div id = 'head'>

  <div class = "head" style = "font-size: 18px;" >

  <div class = "chain" style = "width: 35px; text-align: left; font-size:15px ">
      <input type="radio" value = "0" name="neo" id="neo" v-model="zz">
      <label  for="neo">NEO</label>
      <input type="radio" value = "1" name="ont" id="ont" v-model="zz">
      <label  for="ont">ONT</label>
      <input type="radio" value = "2" name="eth" id="eth" v-model="zz">
      <label  for="eth">ETH</label>
  </div>


    <div style = "width: 80px; text-align: right">{{lastt[zz]}}&nbsp;&nbsp;&#9719;&nbsp;&nbsp;<br>{{block[zz]}}&nbsp;&nbsp;&#9671;&nbsp;&nbsp;</div>
    <a target="blank" href = "http://switcheoexplorer.tech"><img title = 'Switcheo Explorer' style = "width: 45px; height: 45px; margin-top:0px " src="./img/block.gif"/></a> 
    <div style = "width: 80px; text-align: left; margin-top: -2px">&nbsp;&nbsp;&#8651;&nbsp;&nbsp;Txs: {{txs[zz]}}<br><span v-if = "ala[zz] == 'OK'">&nbsp;&nbsp;&#9788;</span><span v-else style = "color: yellow">&nbsp;&nbsp;&#9788;</span>&nbsp;&nbsp;{{ala[zz]}}&nbsp;</div>
    
    <div style = "width: 80px; text-align: right; color: darkcyan"> 
        <span v-if = '(sumcon > 0 || sumch > 0) && sumwal > 0 && namaddr.length > 1'>
            <span v-if = "sumch > 0">SWTH HODL&#9656;<br></span>
            CONTRACT&#9656;
          </span>
    </div>

  </div>
  
  
  <div class = "head" > 
    
     <div class = "sp" style = "width: 80px; font-size: 20px; color: rgb(85, 158, 218); margin-top: -2px; text-align: left">
      <span v-if = '(sumcon > 0 || sumch > 0) && sumwal > 0 && namaddr.length > 1'>
        <span v-if = "sumch > 0" style = "color: darkgoldenrod; ">${{ sumch.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) }}<br></span>
        ${{ sumcon.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) }}
      </span>
    </div> 
    
    <div class = "spp" v-on:click = "add()" style = "width: 155px; font-size: 30px; text-overflow: ellipsis; overflow-x: hidden;  scrollbar-width: none; "><span v-if = "namaddr.length > 0" >${{ animatedNumber }}</span>
      <div v-else  id = "plus" class = "button"  title = "Add Wallets" v-on:click = "add()" style = "width: 40px; padding-bottom: 4px">&#10011;</div>
    </div>

    <div class = "sp" style = "width: 80px; font-size: 20px; margin-top: -2px; text-align: right">
      <span v-if = '(sumcon > 0 || sumch > 0) && sumwal > 0 && namaddr.length > 1'>
        <span v-if = "namaddr.length > 1 && nowwal !='' " style = "color:lightgreen; ">${{ current.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) }} <br></span> 
       ${{ sumwal.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 }) }}
      </span>
    </div>
  </div>



  <div class = "head" style = "font-size: 18px;" >
  
 <div style = "width: 90px; text-align: left; color: darkcyan"> 
        <span v-if = '(sumcon > 0 || sumch > 0) && sumwal > 0 && namaddr.length > 1'>
            <span v-if = "namaddr.length > 1 && nowwal !='' ">&#9666;CURRENT<br></span>
            &#9666;WALLETS
          </span>
    </div>
    <div title = 'DB Sync' id = 'sync'  style = "width: 25px; font-size:25px">
    
    </div>

    <div style = "width: 60px; color: darkcyan; text-align:right">UPDATE&nbsp;<br><span style = "font-size: 16px;">{{w}}</span>&nbsp;</div>

    <div id="bar" style = "width: 50px; padding-left:7px;"></div>
   
    <div class = "sp" style = "width: 100px; color:darkcyan; text-align: left"><span v-if = "login == 1" >
    &nbsp;ID: <span style = "color:lightgreen;"><?= $username ?></span><br>
    &nbsp;SC: <span style = "color:LightBlue"><?= $score ?></span>
    </span>
    </div>
  
</div>

</div>

  <div class = 'tab'>
      <table>
        <thead>
          <tr>
            <th style = "text-align: left; width: 104px">
              <input v-on:click = "listtok(-vm.sortt[1])" type="radio" value = "T" id="sym" v-model="sortt[0]">
              <label for="sym">T O K E N S</label>
              &nbsp;&nbsp;&nbsp;<span v-if = "tokn > 0" style = "color:darkcyan">{{tokn}}</span>
            </th>
            <th class = "com" style = "width: 73px;" >
              <input  v-on:click = "function(){setTimeout(listtok, vm.sortt[1], 100)}" type = "checkbox" id = 'comm' name = "combi" v-model="com">
              <label v-if = 'namaddr.length > 1' for = 'comm'></label>
            </th>
            <th style = "text-align: right; width: 129px;" v-if = "tokenss.length > 1">
              |
              <input v-on:click = "listtok(-vm.sortt[1])" type="radio" value = "P" id="pri" v-model="sortt[0]">
              <label style = "color:darkcyan" for="pri">&nbsp; P &nbsp;</label>|
              <input v-on:click = "listtok(-vm.sortt[1])" type="radio" value = "C" id="con" v-model="sortt[0]">
              <label  style = "color:steelblue" for="con">&nbsp; C &nbsp;</label>|
              <input v-on:click = "listtok(-vm.sortt[1])" type="radio" value = "W" id="wal" v-model="sortt[0]">
              <label  for="wal">&nbsp; W &nbsp;</label>|
              <input v-on:click = "listtok(-vm.sortt[1])" type="radio" value = "U" id="usd" v-model="sortt[0]">
              <label  for="usd">&nbsp; $ &nbsp;</label>|
            </th>
          </tr>
          
        </thead>
        <tbody>
          <tr v-on:click = "function() { window.open('https://www.coingecko.com/en/coins/' + symbolid[t.symbol], '_blank') }" v-for = "t in tokenss">
            <td style = "width: 41px; font-size: 18px;" >
              <span v-if = "t.symbol == 'SWTH'" style = "text-shadow: 0px 0px 6px white;font-weight: 500; ">{{t.symbol}}</span>
              <span v-else>{{t.symbol}}</span>
            </td>
            <td style = "width: 58px; font-size: 16px; text-align: right; color: darkcyan">
                <span v-if = "t.price > 1">${{t.price.toLocaleString('en-EN', {maximumFractionDigits:2 }) }}</span><span v-else-if = "t.price > 0">${{Math.round(t.price*1e6)/1e6}}</span>
            </td>
            <td style = "width: 69px; text-align: right; color: steelblue">
              <span v-if = "t.contract > 1">{{Math.round(t.contract*1e2)/1e2}}</span><span v-else-if  = "t.contract > 0">{{t.contract}}</span>
            </td>
            <td style = "width: 69px; text-align: right">
              <span v-if = "t.total > 1">{{Math.round(t.total*1e2)/1e2}}</span><span v-else-if  = "t.total > 0">{{t.total}}</span>
            </td>
            <td  style = "width: 69px; text-align: right">
             <span v-if = "t.usd > 0"> ${{t.usd.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 })}}</span>
            </td>

            <td v-if = "t.chest1 > 0" style = "width: 41px; color: darkgoldenrod;">
              {{t.symbol}}
            </td>
            <td v-if = "t.chest1 > 0" style = "width: 58px; color: darkgoldenrod;">
              Lite
            </td>
            <td v-if = "t.chest1 > 0" style = "width: 69px; text-align: right; color: darkgoldenrod;">
              {{Math.round(t.chest1*1e2)/1e2}}
              </td>
            <td v-if = "t.chest1 > 0" style = "width: 69px; text-align: right; color: darkgoldenrod;">
                {{t.date1}}
            </td>
            <td v-if = "t.chest1 > 0" style = "width: 69px; text-align: right; color: darkgoldenrod;">
              ${{t.usdch1.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 })}}
            </td>

            <td v-if = "t.chest2 > 0" style = "width: 41px; color: darkgoldenrod;">
              {{t.symbol}}
            </td>
            <td v-if = "t.chest2 > 0" style = "width: 58px; color: darkgoldenrod;">
              Premier
            </td>
            <td v-if = "t.chest2 > 0" style = "width: 69px; text-align: right; color: darkgoldenrod;">
              {{Math.round(t.chest2*1e2)/1e2}}
              </td>
            <td v-if = "t.chest2 > 0" style = "width: 69px; text-align: right; color: darkgoldenrod;">
                {{t.date2}}
            </td>
            <td v-if = "t.chest2 > 0" style = "width: 69px; text-align: right; color: darkgoldenrod;">
              ${{t.usdch2.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 })}}
            </td>


          </tr>
        </tbody>
      </table>
  </div>

  <div class = 'tab'>
     <table>
        <thead>
          <tr>
              <th style = "text-align: left; width: 143px">
                  <input v-on:click = "tabwallets(-sortt[3])" type="radio" value = "A" id="alia" v-model="sortt[2]">
                  <label for="alia">W A L L E T S</label>&nbsp;&nbsp;<span v-if = "namaddr.length > 0" class = "button" v-on:click = "add()" style = "font-size: 17px">&#10011;</span>
                  &nbsp;&nbsp;<span style = "color:darkcyan; font-size:16px">{{rr}}</span>
              </th>
              <th style = "text-align: right; width: 165px;" v-if = "namaddr.length > 1">
                  | <input v-on:click = "tabwallets(-vm.sortt[3])" type="radio" value = "N" id="none" v-model="sortt[2]">
                  <label for="none" style = "font-size: 16px; color: dimgray; vertical-align: 1px" >&nbsp;&#10007; &nbsp;</label>|
                  <input v-on:click = "tabwallets(-vm.sortt[3])" type="radio" value = "D" id="date" v-model="sortt[2]">
                  <label for="date">&nbsp; D &nbsp;</label>|
                  <input v-on:click = "tabwallets(-vm.sortt[3])" type="radio" value = "CH" id="chest" v-model="sortt[2]">
                  <label   style = "color:darkgoldenrod" for="chest">&nbsp; $ &nbsp;</label>|
                  <input v-on:click = "tabwallets(-vm.sortt[3])" type="radio" value = "C" id="cont" v-model="sortt[2]">
                  <label   style = "color:steelblue" for="cont">&nbsp; $ &nbsp;</label>|
                  <input v-on:click = "tabwallets(-vm.sortt[3])" type="radio" value = "W" id="wall" v-model="sortt[2]">
                  <label  for="wall">&nbsp; $ &nbsp;</label>|
                  <input v-on:click = "tabwallets(-vm.sortt[3])" type="radio" value = "S" id="summ" v-model="sortt[2]">
                  <label  style = "font-size: 17px; vertical-align: 2px " for="summ">&nbsp;&sum; &nbsp;</label>|
              </th>
          </tr>
        </thead>
        <tbody>
            <tr class = "wal" tabindex="1" v-for = "w in walletss" v-if = "JSON.stringify(w) != '{}'" v-on:click = "function() {nowwal = w.address; current = w.total; listtok(vm.sortt[1]); listtx() }">
               <td style = "width: 100px; height: 21px; font-weight: 600;outline: 1px;">
                  {{w.alias}}
               </td>
               <td style = "width: 115px; text-align: center;outline:none;">
                  <span v-if ="w.date > 0">{{ moment(w.date*1000).format('DD-MM-YYYY, HH:mm:ss') }}</span>
               </td>
               <td style = "width: 94px; text-align: right; font-weight: 600; outline:none;">
               <span v-if = "w.usd > 0">${{w.usd.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 })}}</span>
               </td>
               <td style = "width: 239px;  font-size: 17px; color: darkcyan;outline:none;">
                <span v-if = "w.chain == 'ETH'" style = "color:DeepSkyBlue">{{w.address}}</span><span v-else>{{w.address}}</span>
               </td>
               <td style = "width: 70px; text-align: right; font-weight: 600; outline:none;">
                  <span style = "color:steelblue" v-if = "w.usdc > 0">${{w.usdc.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 })}}</span>
                </td>
                <td v-if = "w.usdch > 0" style = "width: 100px; color:darkgoldenrod; outline:none;">
                  Switcheo HODL
                </td>
                <td v-if = "w.usdch > 0" style = "width: 109px; text-align: right; color:darkgoldenrod; outline:none;">
                  {{w.chest}}
                </td>
               <td v-if = "w.usdch > 0" style = "width: 100px; text-align: right; font-weight: 600; color:darkgoldenrod; outline:none;">
                ${{w.usdch.toLocaleString('en-EN', {maximumFractionDigits:2, minimumFractionDigits:2 })}}
              </td>
            </tr>
        </tbody>
      </table>
  </div>

  <div class = 'tab'>
      <table>
        <thead>
          <tr>
            <th>T R A N S F E R S&nbsp;&nbsp;&nbsp;<span v-if = " txn > 0 " style = "color:darkcyan"> {{txn}}<span style = "font-weight: 400"></span></span> 

            </th>
          </tr>
        </thead>
        <tbody>
         
            <tr v-on:click = "function() { window.open(item.url, '_blank') }" v-for = "item in transs" v-if = "item.amount > 0">
               
                <td style = "width: 159px; outline: none">
                  {{ Math.round(item.amount*1e8)/1e8 }} <span style = "font-weight: 600">{{item.symbol}}</span>
                </td>
                <td style = "width: 150px; outline: none; text-align: right">{{ moment(item.date*1000).format('DD-MM-YYYY, HH:mm:ss') }}
                </td>
                <td style = "width: 65px; outline: none;">
                 <span v-if = "item.side == '<<<<<<<<<<'" style = "color: darkseagreen">{{item.side}}</span>
                 <span v-if = "item.side == '>>>>>>>>>>'" style = "color:darksalmon ">{{item.side}}</span>
                </td>
                <td style = "width: 244px; text-align: right; font-size: 17px; color: darkcyan; outline: none;">
                  {{item.address}}
                </td>
              </tr>
        </tbody>
      </table>
  </div>

</div>
</div>

<script src = "./src/wallets.js?v1"></script>
<script src = "./src/parallaxsoon2.js"></script>

<script>

function logout() {
axios.post("https://nos.app/api/v1/user/revoke?access_token=" + nostoken);
document.cookie = "PHPSESSID=;"; 
setTimeout(function(){window.location.reload();}, 500);
}

    var urlin = "<?php echo $url ?>"
    var nosaddr = "<?php echo $address ?>";
    var nosuser = "<?php echo $username ?>";
    var nosscore = "<?php echo $score ?>";
    var nostoken = "<?php echo $access_token ?>";
    var addrs = [];
    if (nosuser != '') { logi(1,nosscore); 
    var arr = <?php echo $arrayx ?>;
    
    if (arr == '') addrs.push({'alias':nosuser, 'address':nosaddr, 'script': decode(nosaddr)});
    addrs = addrs.concat(arr);
    splitadd(addrs)
    } else {logi(0,0)}
  
function updatedb(x) {

  $.ajax({
    type:'post',
    url:'/update.php',
    data: {wallets:JSON.stringify(x), iduser:nosuser, idtoken:nostoken}, 
    cash: false,
    success: function(d){ 
      if (d == 'Record updated successfully') {document.getElementById('sync').innerHTML = '<span  style = "color:lightgreen;">&#9991;</span>';
      setTimeout(function() {document.getElementById('sync').innerHTML = '<span  style = "color:darkcyan;">&#9991;</span>'}, 3000) } 
      else { document.getElementById('sync').innerHTML = '<span  style = "color:yellow;">&#9991;</span>';
      setTimeout(function() {document.getElementById('sync').innerHTML = '<span  style = "color:darkcyan;">&#9991;</span>'}, 3000)  }
    }
  });
}

  
</script>

</body></html>