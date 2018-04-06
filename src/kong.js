#!/usr/bin/env nodejs

const axios = require('axios')

module.exports = {
  findDeleteAPIs: function (apiKey, adminUrl) {
    return axios({
      method: 'get',
      url: adminUrl + 'apis/',
      headers: {
        apikey: apiKey
      }
    }
    )
      .then(res => res.status >= 200 && res.status < 300 && res.data.data)
      .then(apis => apis.filter(api => api.name !== 'kong-admin'))
      .then(filteredApis => filteredApis.map(api => api.id))
      .then(apiIds => Promise.all(apiIds.map(apiId => axios.delete(adminUrl + 'apis/' + apiId,
        {
          headers: {
            apikey: apiKey
          }
        }, {}))))
      .catch(function (error) {
        console.log(error)
      })
  },
  uploadConfig: function (apiKey, adminUrl, config) {
    const configJson = JSON.parse(config)

    Promise.all(configJson.apis.map(function (value) {
      axios.post(adminUrl + 'apis/', {
        name: value.name,
        upstream_url: value.attributes.upstream_url,
        uris: value.attributes.uris,
        preserve_host: value.attributes.preserve_host,
        strip_uri: value.attributes.strip_uri,
        methods: value.attributes.methods
      }, {
        headers: {
          apikey: apiKey
        }
      }
      )
    }))
      .then(console.log('API(s) successfully sent !'))
      .catch(function (error) {
        console.error(error)
      })
  }
}
