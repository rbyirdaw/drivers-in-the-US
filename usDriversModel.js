(function(window) {

  function USdriversModel(storage) {
    this._storage = storage;
    this._data = undefined;
  }
  //============================================================================
  USdriversModel.prototype.read = function(year, callback) {
    this._data = this._storage.find(year, callback);
  };

  //============================================================================
  USdriversModel.prototype.getData = function() {
    return this._data;
  };

  //============================================================================
  USdriversModel.prototype.setData = function(data) {
    this._data = data;
  };


  window.usDriversApp = window.usDriversApp || {};
  window.usDriversApp.Model = USdriversModel;
})(window);
