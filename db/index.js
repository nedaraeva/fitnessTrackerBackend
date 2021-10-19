// require and re-export all files in this db directory (users, activities...)
const { client } = require('pg'); // imports the pg module
const express = require('express');

module.exports = {  
    client
  }
  
