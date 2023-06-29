export function validUpdate(updateField) {
  const isValidOperation = updateField.updates.every((update) => {
    return updateField.allowedUpdates.includes(update);
  });
  return isValidOperation;
}
