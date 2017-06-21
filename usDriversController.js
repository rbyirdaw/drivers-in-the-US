(function(window) {

  function USdriversController(model, view) {
    this.model = model;
    this.view = view;
  }

  USdriversController.prototype.update = function(updateObj) {
    if (updateObj.hasOwnProperty('year')) {
      this.model.read(updateObj.year, {});

    } else if (updateObj.hasOwnProperty('ageGroups')) {
      for (ageGroup in updateObj.ageGroups) {
        console.log("ageGroup is "+ageGroup);
      }
      var currentData = this.model.getData();
      this.filterData(currentData)

    }
  };

  USdriversController.prototype.filterData = function(data) {

  };


  window.usDriversApp = usDriversApp || {};
  window.usDriversApp.Controller = USdriversController;

})(window);
