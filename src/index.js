//collection of secrets for the three XRPL nft user accounts in this app
const seedArray = [
  "shGJUUTB89D1ed1ncfLTEZB9KatE5",
  "snkP3PGmJoQ3smGkekaU3pehjtdtH",
  "snJf73Tstd6HHaJr2TH2tniU9apeG",
];

//an object of key/value pairs for Inspector and related XRPL account
const inspAccounts = {
  Inspector_1: "rGFgCYjkcEG43h3Di7Z9PmK46PcSLvTDaX",
  Inspector_2: "rMxoweN9P5k5mfueBoR1NDhamN4ZRLJ6A6",
  Inspector_3: "rEZkdxkdJZ8oKG5JkgDQFJDrMUPLfRdrdn",
};

//create pinata instance
const pinata = myPinata(
  "5a60eac7dc5dd69c42cf",
  "e89b10e72176dd6514470465c2ce3929b1ed55f40e0b3c8383098deb032dc1e5"
);

//set variables for page elements
const _integrity = document.getElementById("integrity");
const _setcondition = document.getElementById("setcondition");
const _trtcondition = document.getElementById("trtcondition");
const _splintering = document.getElementById("splintering");
const _leaning = document.getElementById("leaning");
const _contractor = document.getElementById("contractor");
const _btnCamera = document.getElementById("btn_camera");
const _myCanvas = document.getElementById("myCanvas");
const _inspector = document.getElementById("inspector");
const _poleid = document.getElementById("poleid");
const _lat = document.getElementById("lat");
const _lng = document.getElementById("lng");
const _btnSetInsp = document.getElementById("btn_setinsp");
const _btnNewInsp = document.getElementById("btn_newinsp");
const _inspdate = document.getElementById("inspdate");
const _newPole = document.getElementById("btn_newpole");
const _existInsp = document.getElementById("btn_inspectexisting");
const _acct1 = document.getElementById("acct1");
const _acct2 = document.getElementById("acct2");
const _acct3 = document.getElementById("acct3");

//set array var for pole color
let poleColor = ["red", "blue", "green"];

//track number of pole features interactively added
let poleCount = 0;

//set current inspector - initially set to inspector 1
let myInspector = "Inspector 1";

var colorIndex = 0;
var actionClick = 0;
var dataGeoJSON = null;
var mergedGeoJSON = null;
var tokenCount;

async function SetInspection() {
  //validate user's entries
  if (
    _integrity.value == "" ||
    _setcondition.value == "" ||
    _trtcondition.value == "" ||
    _splintering.value == "" ||
    _leaning.value == "" ||
    _contractor.value == ""
  ) {
    alert("All fields are required");
    return false;
  }

  //get the current data in the form
  const data = {
    poleid: _poleid.value,
    inspector: _inspector.value,
    integrity: _integrity.value,
    setcondition: _setcondition.value,
    trtcondition: _trtcondition.value,
    splintering: _splintering.value,
    leaning: _leaning.value,
    contractor: _contractor.value,
    date: _inspdate.value,
    photo: _myCanvas.value,
    lat: _lat.value,
    lng: _lng.value,
  };

  //create a geoJSON from the data in the form and merge it with master_XRPL pulled down from IPFS
  dataGeoJSON = GeoJSON.parse(data, { Point: ["lat", "lng"] });
  mergedGeoJSON = jsonMerge.merge([master_XRPL, dataGeoJSON]);
  //console.log(JSON.stringify(mergedGeoJSON, null, 2));

  //ADDING A NEW POLE (NFT)
  if (actionClick == 1) {
    //button is in 'isclicked' state
    //check that a point has been added to the map
    if (poleCount == 0) {
      alert("Add a single new pole feature to the map");
      $(".leaflet-container").css("cursor", "crosshair");
      return;
    }
    //add to ipfs - the returned CID will be used to create the NFT
    const body = dataGeoJSON;
    const options = {
      pinataMetadata: {
        name: dataGeoJSON.properties.poleid,
      },
    };
    await PinToIPFS(body, options);
  }
  poleCount = 0;
}

function PinToIPFS(bod, opt) {
  pinata
    .pinJSONToIPFS(bod, opt)
    .then((result) => {
      for (key in result) {
        if (result.hasOwnProperty(key)) {
          var value = result[key];
          break;
        }
      }
      //create NFT for user selected account (inspector)
      var mySeed = myInspector.charAt(myInspector.length - 1);
      Create_NFT(value, seedArray[mySeed - 1]);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function Create_NFT(theURI, theSeed) {
  _btnSetInsp.innerText = "Waiting.....";
  const wallet = myXRPL.Wallet.fromSeed(theSeed);
  const client = new myXRPL.Client("wss://xls20-sandbox.rippletest.net:51233");
  await client.connect();
  console.log("Connected to XRP test blockchain");

  const txJSON = {
    TransactionType: "NFTokenMint",
    Account: wallet.classicAddress,
    URI: myXRPL.convertStringToHex(theURI),
    Flags: parseInt("8"),
    TokenTaxon: 0,
  };
  const tx = await client.submitAndWait(txJSON, { wallet });
  console.log("NFT created");
  client.disconnect();

  //add the pole to the map and add all field attributes
  AddProps(tx.result.hash);

  //style the submit button
  _btnSetInsp.innerText = "Completed";
  _btnSetInsp.style.background = "green";
  _btnSetInsp.style.color = "white";
  _btnSetInsp.disabled = true;

  _integrity.disabled = true;
  _setcondition.disabled = true;
  _trtcondition.disabled = true;
  _splintering.disabled = true;
  _leaning.disabled = true;
  _contractor.disabled = true;

  _existInsp.click();
  actionClick = 1;
}

function AddProps(myHash) {
  var myLat = dataGeoJSON.geometry.coordinates[1];
  var myLng = dataGeoJSON.geometry.coordinates[0];

  //create a new pole on the map and assign it's field attributes as per dataGeoJSON
  var newPole = new L.Circle([myLat, myLng]);
  var feature = (newPole.feature = newPole.feature || {});
  feature.type = feature.type || "Feature";
  var props = (feature.properties = feature.properties || {});
  props.poleid = dataGeoJSON.properties.poleid;
  props.inspector = dataGeoJSON.properties.inspector;
  props.photo = dataGeoJSON.properties.photo;
  props.integrity = dataGeoJSON.properties.integrity;
  props.setcondition = dataGeoJSON.properties.setcondition;
  props.trtcondition = dataGeoJSON.properties.trtcondition;
  props.splintering = dataGeoJSON.properties.splintering;
  props.leaning = dataGeoJSON.properties.leaning;
  props.contractor = dataGeoJSON.properties.contractor;
  props.Xcoord = dataGeoJSON.geometry.coordinates[0];
  props.Ycoord = dataGeoJSON.geometry.coordinates[1];
  props.date = dataGeoJSON.properties.date;
  props.photo = dataGeoJSON.properties.photo;
  props.txhash = myHash;
  addExistingPoles(newPole, props);
}

var mapOptions = {
  center: [39.603427895266876, -104.92581277510011],
  zoom: 16,
};

// Creating a map object
var map = new L.map("themap", mapOptions);
var myRenderer = L.canvas({ padding: 0.5, tolerance: 25 });

// Creating a Layer object
var layer = new L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
);

// Adding layer to the map with onclick event
map.addLayer(layer);
map.on("click", addMouseClick);

//get location on map of user click
function addMouseClick(event) {
  if (document.getElementById("themap").style.cursor == "crosshair") {
    var mylat = event.latlng.lat;
    var mylong = event.latlng.lng;
    //add new pole with inspection
    addNewPole(mylat, mylong);
  } else {
    //clear all data from form
    _integrity.selectedIndex = 0;
    _setcondition.selectedIndex = 0;
    _trtcondition.selectedIndex = 0;
    _splintering.selectedIndex = 0;
    _leaning.selectedIndex = 0;
    _contractor.selectedIndex = 0;
    _poleid.value = "";
    _inspector.value = "";
    _inspdate.value = "";
    _btnNewInsp.disabled = true;
    const context = _myCanvas.getContext("2d");
    context.clearRect(0, 0, _myCanvas.width, _myCanvas.height);
  }
}

function addNewPole(myY, myX) {
  var newPole = L.circle([myY, myX]);
  var intjson = newPole.toGeoJSON();
  var geojson2 = L.geoJson(intjson, {
    style: function (feature) {
      return { color: poleColor[colorIndex] };
    },
    pointToLayer: function (feature, latlng) {
      return new L.Circle(latlng, {
        radius: 15,
        fillOpacity: 0.85,
        renderer: myRenderer,
      });
    },
  });
  map.addLayer(geojson2);
  $(".leaflet-container").css("cursor", "");
  poleCount++;
  tokenCount++;
  _lat.value = myY;
  _lng.value = myX;
}

function SetPreviousInspection(myprops) {
  //this function gets called during the map pole click event
  //it will populate the form with the data from the most recent inspection
  if (myInspector == "") {
    alert("Select an active Inspector.");
    return false;
  }

  _poleid.value = myprops.poleid;
  _integrity.value = myprops.integrity;
  _setcondition.value = myprops.setcondition;
  _trtcondition.value = myprops.trtcondition;
  _splintering.value = myprops.splintering;
  _leaning.value = myprops.leaning;
  _contractor.value = myprops.contractor;
  _inspector.value = myprops.inspector;
  _lat.value = myprops.Ycoord;
  _lng.value = myprops.Xcoord;
  _inspdate.value = myprops.date;
  _myCanvas.value = myprops.photo;

  _btnSetInsp.disabled = true;
  _integrity.disabled = true;
  _setcondition.disabled = true;
  _trtcondition.disabled = true;
  _splintering.disabled = true;
  _leaning.disabled = true;
  _contractor.disabled = true;
  _btnNewInsp.disabled = false;

  //add a random photo
  SetCamera();
}

//display poles (NFTs) on the map (colored according to acct)
var geojsonLayer;
function addExistingPoles(newPole, props) {
  //export geometry and attribute to geoJSON
  var intjson = newPole.toGeoJSON();
  geojsonLayer = L.geoJson(intjson, {
    style: function (feature) {
      return {
        color:
          poleColor[props.inspector.charAt(props.inspector.length - 1) - 1],
      };
    },
    pointToLayer: function (feature, latlng) {
      return new L.Circle(latlng, {
        radius: 15,
        fillOpacity: 0.85,
        renderer: myRenderer,
      });
    },
    onEachFeature: function (feature, layer) {
      layer.on({
        click: function (e) {
          SetPreviousInspection(props);
          _btnSetInsp.style.background = "rgb(230, 223, 223)";
          _btnSetInsp.style.color = "grey";
          _btnCamera.disabled = true;

          $(".leaflet-container").css("cursor", "");
          document.getElementById("btn_inspectexisting").style.backgroundColor =
            "#7ad67d";
          document.getElementById("btn_newpole").style.backgroundColor =
            "#5aa15c";
          actionClick = 0;
        },
      });

      //add popup to poles with poleid and link to XRPL explorer
      var theHash = props.txhash;
      var container = $("<div />");
      container.on("click", function () {
        window.open("https://nft-devnet.xrpl.org/transactions/" + theHash);
      });
      container.html("<a href='#'>XRPL Explorer</a>.");
      container.append($('<span class="bold">').text(props.poleid));
      layer.bindPopup(container[0]);
    },
  });
  map.addLayer(geojsonLayer);
  $(".leaflet-container").css("cursor", "");
}

async function BtnNew(myID) {
  //set parameters of inspection elements
  SetElements(0);
  _poleid.value = "UTP-0" + tokenCount;
  _btnCamera.disabled = false;
  _inspector.value = myInspector;
  _btnSetInsp.innerText = "Submit";
  _btnSetInsp.style.background = "rgb(230, 223, 223)";
  _btnSetInsp.style.color = "black";
  _btnNewInsp.disabled = true;

  //clear image canvas
  const context = _myCanvas.getContext("2d");
  context.clearRect(0, 0, _myCanvas.width, _myCanvas.height);

  map.closePopup();
  $(".leaflet-container").css("cursor", "crosshair");
  document.getElementById(myID).style.backgroundColor = "#7ad67d";
  document.getElementById("btn_inspectexisting").style.backgroundColor =
    "#5aa15c";
  actionClick = 1;
}

function BtnExisting(myID) {
  //clear all data from form
  _integrity.selectedIndex = 0;
  _setcondition.selectedIndex = 0;
  _trtcondition.selectedIndex = 0;
  _splintering.selectedIndex = 0;
  _leaning.selectedIndex = 0;
  _contractor.selectedIndex = 0;
  _poleid.value = "";
  _inspector.value = "";
  _inspdate.value = "";
  _btnNewInsp.disabled = true;

  $(".leaflet-container").css("cursor", "");
  document.getElementById(myID).style.backgroundColor = "#7ad67d";
  document.getElementById("btn_newpole").style.backgroundColor = "#5aa15c";
  actionClick = 0;

  //clear image canvas
  const context = _myCanvas.getContext("2d");
  context.clearRect(0, 0, _myCanvas.width, _myCanvas.height);
}

async function tokenCounter() {
  //get the total number of NFTs in all three accounts
  var myCount = 0;
  for (k = 0; k < seedArray.length; k++) {
    const wallet = myXRPL.Wallet.fromSeed(seedArray[k]);
    const client = new myXRPL.Client(
      "wss://xls20-sandbox.rippletest.net:51233"
    );
    await client.connect();

    const nfts = await client.request({
      method: "account_nfts",
      account: wallet.classicAddress,
    });
    myCount = myCount + nfts.result.account_nfts.length;
    client.disconnect();
  }
  return myCount;
}

function newInsp() {
  alert("This functionality has been disabled in this demo.");
}

function SetElements(ind) {
  _poleid.style.visibility = "visible";
  _integrity.selectedIndex = ind;
  _setcondition.selectedIndex = ind;
  _trtcondition.selectedIndex = ind;
  _splintering.selectedIndex = ind;
  _leaning.selectedIndex = ind;
  _contractor.selectedIndex = ind;

  _btnSetInsp.disabled = false;
  _btnSetInsp.style.background = "rgb(230, 223, 223)";
  _btnSetInsp.style.color = "black";

  _integrity.disabled = false;
  _setcondition.disabled = false;
  _trtcondition.disabled = false;
  _splintering.disabled = false;
  _leaning.disabled = false;
  _contractor.disabled = false;
  _btnCamera.disabled = false;

  var current_datetime = new Date();
  var formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  _inspdate.value = formatted_date;
}

function SetInspector(acct, clrind) {
  myInspector = document.getElementById(acct).innerHTML.substring(0, 11);
  if (acct == "acct1label") {
    _acct2.checked = false;
    _acct2.disabled = true;
    _acct3.checked = false;
    _acct3.disabled = true;
  } else if (acct == "acct2label") {
    _acct1.checked = false;
    _acct1.disabled = true;
    _acct3.checked = false;
    _acct3.disabled = true;
  } else if (acct == "acct3label") {
    _acct1.checked = false;
    _acct1.disabled = true;
    _acct2.checked = false;
    _acct2.disabled = true;
  }
  _existInsp.disabled = false;
  _newPole.disabled = false;

  colorIndex = clrind;
}

function resetInsp() {
  _acct1.checked = false;
  _acct1.disabled = false;
  _acct2.checked = false;
  _acct2.disabled = false;
  _acct3.checked = false;
  _acct3.disabled = false;
  _existInsp.disabled = true;
  _newPole.disabled = true;
  _btnNewInsp.disabled = true;
  myInspector = "";
}

async function InitialLoad() {
  tokenCount = await tokenCounter();

  var xArray = [];
  var yArray = [];
  for (var i = 0; i < master_XRPL.features.length; i++) {
    xArray.push(master_XRPL.features[i].geometry.coordinates[0]);
    yArray.push(master_XRPL.features[i].geometry.coordinates[1]);
  }

  for (var j = 0; j < xArray.length; j++) {
    var existPole = new L.Circle([yArray[j], xArray[j]]);
    var feature = (existPole.feature = existPole.feature || {});
    feature.type = feature.type || "Feature";
    var props = (feature.properties = feature.properties || {});
    props.poleid = master_XRPL.features[j].properties.poleid;
    props.inspector = master_XRPL.features[j].properties.inspector;
    props.photo = master_XRPL.features[j].properties.photo;
    props.integrity = master_XRPL.features[j].properties.integrity;
    props.setcondition = master_XRPL.features[j].properties.setcondition;
    props.trtcondition = master_XRPL.features[j].properties.trtcondition;
    props.splintering = master_XRPL.features[j].properties.splintering;
    props.leaning = master_XRPL.features[j].properties.leaning;
    props.contractor = master_XRPL.features[j].properties.contractor;
    props.Xcoord = master_XRPL.features[j].geometry.coordinates[0];
    props.Ycoord = master_XRPL.features[j].geometry.coordinates[1];
    props.date = master_XRPL.features[j].properties.date;
    props.txhash = master_XRPL.features[j].properties.txhash;

    addExistingPoles(existPole, props);
  }

  SetTrimAcct(inspAccounts.Inspector_1, "acct1label", 1);
  SetTrimAcct(inspAccounts.Inspector_2, "acct2label", 2);
  SetTrimAcct(inspAccounts.Inspector_3, "acct3label", 3);

  _acct1.checked = true;
  _acct2.disabled = true;
  _acct3.disabled = true;

  _btnCamera.disabled = true;
  _integrity.disabled = true;
  _setcondition.disabled = true;
  _trtcondition.disabled = true;
  _splintering.disabled = true;
  _leaning.disabled = true;
  _contractor.disabled = true;
  _btnSetInsp.disabled = true;
}

function SetTrimAcct(theAccount, myLabel, theInspector) {
  var trimAcct =
    theAccount.substr(0, 6) +
    "......" +
    theAccount.substr(theAccount.length - 4, theAccount.length);
  var fullAcct = (document.getElementById(myLabel).innerHTML =
    "Inspector " + theInspector + "&nbsp &nbsp" + "(" + trimAcct + ")");
}

function SetCamera() {
  var randint = Math.floor(Math.random() * 11); //a random integer from 0 to 10
  var canvas = _myCanvas;
  var ctx = canvas.getContext("2d");
  var imageObj = new Image();
  imageObj.src = "img/UTP-" + randint.toString() + ".jpg";
  imageObj.onload = function () {
    ctx.drawImage(
      imageObj,
      0,
      0,
      imageObj.width,
      imageObj.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };
}
