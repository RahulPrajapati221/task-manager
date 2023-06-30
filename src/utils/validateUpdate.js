export function validUpdate(updates, allowedUpdates) {
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  return isValidOperation;
}
