
(function(window) {

  function USdriversStorage(dataURL) {
    this._dataURL = dataURL;
  }

//==============================================================================
  USdriversStorage.prototype.find = function(year, callback) {
    var driverData,
        xhr,
        self = this;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if((xhr.readyState === 4) && (xhr.status === 200)) {
        if(xhr.getResponseHeader("Content-type") !== "application/json") {
          console.log("Received non-json data.");
        } else {
          //console.log("Data received OK: "+xhr.responseText);
          driverData = JSON.parse(xhr.responseText);
          //console.log("Data received OK: "+driverData[1999].maleDrivers);

          callback(driverData);

        }

      }//onreadystatechange
    }
    xhr.open("POST", this._dataURL, true);
    xhr.send(null);

  };

  window.usDriversApp = window.usDriversApp || {};
  window.usDriversApp.Storage = USdriversStorage;
})(window);
