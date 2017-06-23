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

  //============================================================================
  USdriversController.prototype.update = function(updateObj) {
    var self = this;

    if (updateObj.hasOwnProperty('year')) {
      this.model.read(updateObj.year, function(d) {
        self.model.setData(d);
      });

    } else if (updateObj.hasOwnProperty('ageGroup')) {
      console.log("ageGroup is "+updateObj.ageGroup);

      var currentData = this.model.getData(),
          maleDriverCounts,
          femaleDriverCounts;

      if (this.maleDrivers.show) {
        maleDriverCounts =
            this.getAgeGroupCounts(updateObj.ageGroup, currentData.maleDrivers);
      }

      if (this.femaleDrivers.show) {
        femaleDriverCounts =
            this.getAgeGroupCounts(updateObj.ageGroup, currentData.femaleDrivers);
      }

      this.updateDriverTotals();

    } else if (updateObj.hasOwnProperty('showMaleDrivers')) {
      this.maleDrivers.show = updateObj.showMaleDrivers;
    }
  };

  //============================================================================
  USdriversController.prototype.getAgeGroupCounts =
      function(ageGroup, dataByGender) {
        if (dataByGender.length !== 51) {
          console.log("Incorrect data type [getAgeGroupCounts]");
          return;
        } else {
          var ageGroupIndex = this.ageGroupMap.get(ageGroup),
              ageGroupCounts = [];

          if (ageGroupIndex === undefined) {
            console.log("Age ground index not found [getAgeGroupCounts]");
            return;

          } else {
            dataByGender.forEach(function(e) {
              ageGroupCounts.push(e.age_group_count[ageGroupIndex].count);
            });

            return ageGroupCounts;
          }
        }
  };

  //============================================================================
  USdriversController.prototype.updateDriverTotals = function() {

  };
  //============================================================================
  USdriversController.prototype.ageGroupMap = new Map([
    ["19_and_under", 0],
    ["20_24", 1],
    ["25_29", 2],
    ["30_34", 3],
    ["35_39", 4],
    ["40_44", 5],
    ["45_49", 6],
    ["50_54", 7],
    ["55_59", 8],
    ["60_64", 9],
    ["65_69", 10],
    ["70_74", 11],
    ["75_79", 12],
    ["80_84", 13],
    ["85_and_over", 14]
  ])


  window.usDriversApp = usDriversApp || {};
  window.usDriversApp.Controller = USdriversController;

})(window);
