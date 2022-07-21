// объект артефактов предоставляется фреймворком трюфеля
//artifacts.require () похож на метод require () в Node
// Компилируем код контракта. Автоматически вызывать компилятор solc для компиляции кода контракта и возврата объекта результата компиляции
var Ballot = artifacts.require("./Ballot.sol");
var SimpleToken = artifacts.require("./SimpleToken.sol");

// Средство развертывания объекта Deployer предоставляется фреймворком Truffle
module.exports = function(deployer) {
    deployer.deploy(Ballot);
    deployer.deploy(SimpleToken,200,"SoloToken", "SOLO");
};
