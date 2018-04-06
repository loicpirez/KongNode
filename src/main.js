#!/usr/bin/env node

const process = require('process')
const kong = require('./kong.js')
const fs = require('fs')

const apiKey = process.env.API_KEY
const adminUrl = process.env.ADMIN_URL
const configFile = 'config/task.json'

if (!apiKey || !adminUrl) {
  console.error('Please set your env variables.')
  process.exit(1)
}

kong.findDeleteAPIs(apiKey, adminUrl)
  .then(function () {
    fs.stat(configFile, function (err) {
      if (err && err.code === 'ENOENT') {
        console.error('Config file (config/task.json) does not exist.')
        process.exit(1)
      }
      fs.readFile(configFile, 'utf8', function (err, contents) {
        if (err) {
          console.log(err)
        }
        kong.uploadConfig(apiKey, adminUrl, contents)
      })
    }
    )
  }
  )
