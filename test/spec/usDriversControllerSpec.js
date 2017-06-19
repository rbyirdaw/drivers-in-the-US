describe ("USdriversController", function() {

  var storage = new window.usDriversApp.Storage("../sampleData.json"),
      model = new window.usDriversApp.Model(storage),
      view = {},
      controller = new window.usDriversApp.Controller(model, view);

  beforeEach(function() {
    model.read(1999, model.setData);

  });

  describe("when year is selected,", function() {
    var year = 2000;
    beforeEach(function() {
      spyOn(model, 'read');
      spyOn(model, 'setData');
    });
    it("should retrieve data for selected year", function() {
      controller.update({year: year});
      expect(model.read).toHaveBeenCalled();
    });
    it("should set retrieved data as current data", function() {
      var currentData = model.getData();
      controller.update({year: year});
      var newData = model.getData();

      expect(currentData.maleDrivers[0].age_group_count[0].count)
        .not.toEqual(newData.maleDrivers[0].age_group_count[0].count);
    });
  });

  describe("when age group is selected", function() {
    var ageGroups = {
        "20_24": true,
        "45_49": false
      };

    beforeEach(function() {
      spyOn(model, 'getData');
      spyOn(controller, 'filterData');
    });
    it("should update current data selection", function() {
      controller.update({ageGroups: ageGroups});
      expect(model.getData).toHaveBeenCalled();
      expect(controller.filterData).toHaveBeenCalled();
    });
  })

});
