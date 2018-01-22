import graphTraversal from '../../state/graphTraversal';
import ComponentTypes from '../../domain/component/ComponentTypes';

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

  it('should find the ancestor correctly.', () => {
    // Arrange
    const descendentNode = graphTraversal.find(model, 456);

    // Act
    const nodeFound = graphTraversal.findAncestorByTypeLabel(model, descendentNode, ComponentTypes.WebPage);

    // Assert
    expect(nodeFound).to.not.be.equal(null);
    expect(nodeFound.typeLabel).to.be.equal(ComponentTypes.WebPage);
  });
});
