describe ("USdriversController", function() {

  var storage = new window.usDriversApp.Storage("../sampleData.json"),
      model = new window.usDriversApp.Model(storage),
      view = {},
      controller = new window.usDriversApp.Controller(model, view);

  describe("when year is selected,", function() {
    var year = 1999;

    beforeEach(function() {
      spyOn(model, 'read');
      controller.update({year: year});
    });

    it("should retrieve data for selected year", function() {
      expect(model.read).toHaveBeenCalled();
    });

  });


  xdescribe("when gender is selected", function() {
    it("should set corresponding flag", function() {
      controller.update({showMaleDrivers: true});
      expect(controller.maleDrivers.show).toEqual(true);
    });
  });

  xdescribe("when gender is de-selected", function() {
    it("should un-set corresponding flag", function() {
      controller.update({showMaleDrivers: false});
      expect(controller.maleDrivers.show).toEqual(false);
    });
  });

  xdescribe("when age group is selected,", function() {
    beforeEach(function() {
      spyOn(controller, 'getAgeGroupCounts');
      spyOn(controller, 'updateDriverTotals');
    });
    it("should add age group's count to total", function() {
      controller.update({ageGroup: "20_24", show: true});
      expect(controller.getAgeGroupCounts).toHaveBeenCalled();
      expect(controller.updateDriverTotals).toHaveBeenCalled();
    });
  });

  describe("when age group is selected,", function() {

    //need some data first
    beforeEach(function(done) {
      controller.model.read(1999, function(d) {
        controller.model.setData(d);
        done();
      });
    });
    describe("and male driver count is shown,", function() {
      var ageGroupObj = {ageGroup: "20_24", show: true};

      it("should retrieve counts for selected age group", function() {
        var currData = controller.model.getData(),
            counts = controller.getAgeGroupCounts(
                  ageGroupObj.ageGroup, currData.maleDrivers);
        expect(counts.length).toEqual(51);
      });

    });

  });


});
