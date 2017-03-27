import { expect } from 'chai';
import ComponentService from '../../../service/component/componentService';

describe('ComponentService', () => {
  it('removeChildFromParent should return successfully.', () => {
    // Arrange
    const parent = {
      children: [
        { id: '123' },
        { id: '234' },
        { id: '345' }
      ]
    };

    const componentService = new ComponentService();

    componentService.removeChildFromParent(parent, '345');

    c.lo(parent);

    expect(parent.children.length).to.equal(2);
  });
});
