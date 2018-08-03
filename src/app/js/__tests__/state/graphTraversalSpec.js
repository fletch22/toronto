import graphTraversal from '../../../../common/state/graphTraversal';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import stateTraversal from 'common/state/stateTraversal';

describe('graphTraversal', () => {
  const existingSelects = ['Select-1', 'Select-2'];
  let model = null;

  beforeEach(() => {
    model = {
      app: {
        id: 123,
        typeLabel: ComponentTypes.WebPage,
        children: [
          { typeLabel: ComponentTypes.ButtonSubmit, name: existingSelects[0], parentId: 123 },
          { typeLabel: ComponentTypes.ButtonSubmit, name: existingSelects[1], parentId: 123 },
          { id: 234, typeLabel: ComponentTypes.Div, name: 'divThing-1', parentId: 123,
            children:
            [
              {
                id: 345,
                parentId: 234,
                typeLabel: ComponentTypes.Div, name: 'divThingInner-1',
                children: [
                  { id: 456, parentId: 345, typeLabel: ComponentTypes.Layout, name: 'LayoutThing-1' }
                ]
              }
            ]
          }
        ]
      }
    };
  });

  it('should collect the right things.', () => {
    // Arrange
    // Act
    const matches = graphTraversal.collectPropValuesByPropName(model, 'name');

    // Assert
    expect(matches.length).to.be.equal(5);
    expect(matches.includes(existingSelects[0]));
    expect(matches.includes(existingSelects[1]));
  });

  it.skip('should find the ancestor correctly.', () => {
    // Arrange
    const descendentNode = graphTraversal.find(model, 456);

    // Act
    const nodeFound = graphTraversal.findAncestorByTypeLabel(model, descendentNode, ComponentTypes.WebPage);

    // Assert
    expect(nodeFound).to.not.be.equal(null);
    expect(nodeFound.typeLabel).to.be.equal(ComponentTypes.WebPage);
  });

  it('should find the all Div correctly.', () => {
    // Arrange
    // Act
    const divs = graphTraversal.findByPropNameAndValue(model, 'typeLabel', ComponentTypes.Div);

    // Assert
    expect(divs).to.not.be.equal(null);
    expect(Array.isArray(divs)).to.be.equal(true);
    expect(divs.length).to.be.equal(2);
  });

  it('should get all the descendents with an attribute that matches the object', () => {
    // Arrange
    const node = {
      id: 12,
      children: [
        {
          id: 123,
          foo: 'bar',
          children: [
            {
              id: 777,
              bar: {
                id: 234,
                fruit: 'tastey'
              }
            }
          ]
        }
      ]
    };

    // Act
    const refs = graphTraversal.findDescendentsWithAttributeObjectKey(node, 'fruit');

    // Assert
    expect(!!refs).to.be.equal(true);
    expect(Array.isArray(refs)).to.be.equal(true);
    expect(refs.length).to.be.equal(1);
    const singleRef = refs[0];
    expect(typeof singleRef).to.be.equal('object');
    expect(singleRef.id).to.be.equal(777);
    expect(singleRef.attributeName).to.be.equal('bar');
    expect(singleRef.keyToFindAttributeValue).to.be.equal('tastey');
  });

  it('should get all the descendents attribute values with an attribute.', () => {
    // Arrange
    const node = {
      id: 12,
      children: [
        {
          id: 123,
          foo: 'bar',
          children: [
            {
              id: 777,
              bar: {
                id: 234,
                fruit: 'tastey'
              }
            }
          ]
        }
      ]
    };

    // Act
    const refs = graphTraversal.findAllAttributeValuesFromDescendentsWithAttribute(node, 'id');

    // Assert
    expect(Array.isArray(refs)).to.be.equal(true);
    refs.sort();
    expect(JSON.stringify(refs)).to.be.equal('[12,123,234,777]');
  });
});
