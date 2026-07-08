export const isOutsideDialog = ({ currentTarget, clientX, clientY }) => {
  const rect = currentTarget.getBoundingClientRect();

  return (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  );
};
