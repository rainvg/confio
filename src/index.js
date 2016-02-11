var fs = require('fs');
var path = require('path');

function confio(config_path, default_path)
{
  'use strict';

  if(!(this instanceof confio))
    throw {code: 0, description: 'Constructor must be called with new.', url: ''};

  var self = this;

  // Constructor

  var _config_path = config_path;
  var _default_path = default_path;

  // Getters

  self.path = {
    config: function()
    {
      return _config_path;
    },
    default: function()
    {
      return _default_path;
    }
  };

  // Methods

  self.get = function(key)
  {
    try
    {
      var configuration = JSON.parse(fs.readFileSync(_config_path));

      if(typeof configuration[key] === 'undefined')
        throw false;

      return configuration[key];
    }
    catch(error)
    {
      try
      {
        var configuration = JSON.parse(fs.readFileSync(_default_path));

        if(typeof configuration[key] === 'undefined')
          throw false;

        return configuration[key];
      }
      catch(error)
      {
        throw {code: 1, description: 'Key not found. Files could be corrupted.', url: ''};
      }
    }
  };

  self.set = function(key, value)
  {
    var configuration = {};

    try
    {
      configuration = JSON.parse(fs.readFileSync(_config_path));
    }
    catch(error)
    {
    }

    configuration[key] = value;

    try
    {
      var tmp_path = path.parse(_config_path);
      tmp_path.name = '._' + tmp_path.name;
      tmp_path = path.format(tmp_path);

      fs.writeFileSync(tmp_path, JSON.stringify(configuration));
      fs.renameSync(tmp_path, _config_path);
    }
    catch(error)
    {
      throw {code: 2, description: 'Failed to write to file.'};
    }
  };
}

module.exports = {
  confio: confio
};
