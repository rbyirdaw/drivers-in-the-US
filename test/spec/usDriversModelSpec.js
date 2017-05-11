
describe("usDriversModel", function() {
  var storage,
      model,
      driverData,
      year = 1999;

  beforeEach(function(done) {
    storage = new window.usDriversApp.Storage("../sampleData.json");
    model = new window.usDriversApp.Model(storage);

    spyOn(model, 'setData').and.callThrough();

    model.read(1999, function(d) {
      model.setData(d);
      done();
    });

  });

  it("should read JSON data for a given year using storage instance", function(){
    expect(model.setData).toHaveBeenCalled();
  });
  it("should return current data", function() {
    expect(model.getData()).not.toBeUndefined();
  });
});
