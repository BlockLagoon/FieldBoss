<div id="top"></div>
<div align="center">
  <h1 align="center"><< FieldBoss >></h1>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#what-is-fieldboss">What Is FieldBoss</a></li>
    <li>
      <a href="#what-is-a-geo-located-nft">What Is A Geo-Located NFT</a>
      <ul>
        <li><a href="#geojson">Schema</a></li>
      </ul>
    </li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#notes">Notes</a></li>
        <li><a href="#navigating-the-ui">Navigating the UI</a></li>
      </ul>
    </li>
     <li><a href="#usage">GeoJSON</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## What Is FieldBoss
FieldBoss is a software tool developed for mobile devices that merges blockchain technology with popular open source GIS mapping applications through the use of geo-located XRPL NFTs.  With FieldBoss, mobile GIS applications are extended to include the real-time tokenization of 2d/3d unique geometries collected by field crews via GPS.   By combining the analytical power of GIS (assets represented spatially) with the transparency, immutability, and security of blockchain technology we can show the spatial and temporal distribution of information which is securely stored on blockchain and distributed file systems.

## What Is A Geo-Located NFT
Geo-located XRPL NFTs adhere to the GeoJSON spatial data standard recognized by most GIS mapping applications which provides interoperability between FieldBoss and GIS.  Geometries can be point line or poly

## About The Project
Here we present a FieldBoss use case showing how geo-located NFTs created on the XRPL Ledger could be used in a mobile field mapping application that performs and manages routine inspections of utility poles in a municipal district.  Point geometries (poles) on the map represent NFTs which store the inspection history of each pole (inspector, date, account).  Metadata in IPFS stores the inspection data for each pole including all previous inspections.  The metadata is linked to the NFT via a common field.  Geo-located NFTs are transferred as non-payable transactions from the previous inspector to current inspector during a utility pole inspection resulting in an immutable inspection history for each pole

![Product Name Screen Shot][product-screenshot]

### Built With
* [Leaflet.js](https://leafletjs.com/) – a popular open source JavaScript library for building web mapping applications
* [xrpl.js](https://xrpl.org/)
* [XRP Ledger](https://xrpl.org/) - NFT Devnet
* [Pinata](https://https://www.pinata.cloud/)
* [IPFS](https://https://www.ipfs.io/)
<p align="right">(<a href="#top">back to top</a>)</p>


## Getting Started
This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
This is an example of how to list things you need to use the software and how to install them.

### Installation
_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._
<p align="right">(<a href="#top">back to top</a>)</p>


## Usage

### Notes
*	The XRPL_FieldBoss.html web page is a proof of concept built as a desktop application for the purpose of demonstration but will be ultimately deployed on GPS enabled mobile field devices running Android and/or iOS operating systems.
*	This application is fully integrated with Pinata/IPFS for GeoJSON upload and download.  However, to avoid wait times, a local GeoJSON file is being used as the metadata source (config.geojson).
*	This POC demo has been pre-loaded with 3 XRPL NFT accounts on NFT-Devnet.  Each account has several geo-located NFTs already minted as shown on the map.
![Product Name Screen Shot][product-screenshot2]
<p align="right">(<a href="#top">back to top</a>)</p>

### Navigating the UI
1.	At all times there will be an active inspector which represents the XRPL NFT account that will be performing any inspections.  The default account is Inspector 1.  Reset with @
2.	The active inspector has two options for interacting with the map:	
    * 'View Existing' allows the active inspector to click on a pole feature (NFT) on the map and review the results (metadata) of the most recent inspection for that pole and to view details of the NFT in the XRPL Explorer.  Any photos stored with the metadata of that NFT will be displayed in the image pane on the form.

    * 'Add New Pole' allows the active inspector to place a new pole on the map with a mouse click.  This will be performed via GPS in the mobile version.  The inspection form is completed and upon SUBMIT a new pole (geo-located NFT) is created on the XRP Ledger residing in the active inspector’s account.  Data from the inspection form becomes the NFT’s metadata and is stored as GeoJSON in IPFS. 
3.	'Add New Inspection' is activated when an existing pole is selected on the map.  This tool allows the active inspector to create a new inspection record for that pole at the current date and time.  Upon SUBMIT, the form is updated with the current data and ownership of the NFT (representing that pole) is transferred from the current owner’s NFT account to the active inspector’s NFT account on the XRP Ledger.  Thus, a time sequenced record of inspection activity for each pole is maintained on the XRP Ledger.  Metadata gets merged into the ever growing ‘XRPL_Master_GeoJSON’ file stored in IPFS.
  Note: this functionality is not activated in the demo


## GeoJSON
Use this space to show useful examples of how a project can be use
<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap
- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
<p align="right">(<a href="#top">back to top</a>)</p>

## License
Distributed under the MIT License. See `LICENSE.txt` for more information.
<p align="right">(<a href="#top">back to top</a>)</p>

## Contact
Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com
Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/xrpl_grant.png
[product-screenshot2]: images/xrpl_grant2.png
