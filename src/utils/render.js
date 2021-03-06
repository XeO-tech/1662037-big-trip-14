import Abstract from '../view/abstract';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, viewComponent, position) => {
  const element = viewComponent.getElement();

  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      container.parentNode.append(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
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

export const remove = (viewComponent) => {
  if (viewComponent === null) {
    return;
  }

  if (!(viewComponent instanceof Abstract)) {
    throw new Error('Only components can be removed');
  }

  viewComponent.getElement().remove();
  viewComponent.removeElement();
};
