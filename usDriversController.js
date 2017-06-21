(function(window) {

  function USdriversController(model, view) {
    this.model = model;
    this.view = view;
    this.maleDrivers = {
      show: true,
      totals: []
    };
    this.femaleDrivers = {
      show: false,
      totals: []
    }
  }

  USdriversController.prototype.update = function(updateObj) {
    var self = this;

    if (updateObj.hasOwnProperty('year')) {
      this.model.read(updateObj.year, function(d) {
        self.model.setData(d);
      });

    } else if (updateObj.hasOwnProperty('ageGroups')) {
      for (ageGroup in updateObj.ageGroups) {
        console.log("ageGroup is "+ageGroup);
      }
      var currentData = this.model.getData();
      this.filterData(currentData)

    } else if (updateObj.hasOwnProperty('showMaleDrivers')) {
      this.maleDrivers.show = updateObj.showMaleDrivers;
    }
  };

  USdriversController.prototype.filterData = function(data) {

  };


  window.usDriversApp = usDriversApp || {};
  window.usDriversApp.Controller = USdriversController;

})(window);
