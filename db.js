const path = require('path');
const bodyparser = require("body-parser");
const express = require('express');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const HOSTNAME = 'localhost';

const session = require('express-session');



  
