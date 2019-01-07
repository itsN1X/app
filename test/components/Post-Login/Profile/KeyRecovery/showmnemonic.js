const assert = require('assert');
const showMnemonic = require('../../../../../js_func/components/Post-Login/Profile/KeyRecovery/showmnemonic.js')




describe('Check shares are unique', function() {
  describe('#indexOf()', function() {
    it('should decrypt data', function(){
      assert.equal(showMnemonic.decryptData('123','12312'), 'abc');
    });
  });
});
