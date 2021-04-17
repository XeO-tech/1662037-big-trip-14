import Abstract from '../view/abstract';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, component, position) => {
  const element = component.getElement();
  switch (position) {
    case 'beforebegin':
      container.parentNode.append(element);
      break;
    case 'afterbegin':
      container.prepend(element);
      break;
    case 'beforeend':
      container.append(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {

  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }
  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error ('Can\'t replace non existing elements');
  }
  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Only components can be removed');
  }
  component.getElement().remove();
  component.removeElement();
};
