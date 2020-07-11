const { authing } = require('./driveAuth');

const checkForChanges = async () => {
  const actionMethod_1 = ['changes'];
  const actionType_2 = ['getStartPageToken'];

  const getStartPageToken = {
    fields: '*',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  };

  const resulting = await authing(getStartPageToken, actionMethod_1, actionType_2);
  // return resulting;

  const pageToken = resulting.data.startPageToken;
  console.log(pageToken);
  const actionMethod = ['changes'];
  const actionType = ['list'];

  const getChangesData = {
    pageToken: pageToken - 1,
    fields: '*',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  };

  const changesData = await authing(getChangesData, actionMethod, actionType);

  const changesMade = changesData.data.changes[0];
  console.log(changesMade)

  const parentId = changesMade.file.parents

  const parentIdString = parentId.toString();

  const parentFileDetails = {
    fileId: parentIdString,
    fields: '*',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  };
  const parentAction = ['files'];
  const parentMethod = ['get']

  const parentFiles = await authing(parentFileDetails, parentAction, parentMethod);
  console.log(parentFiles)

};

module.exports = {
  checkForChanges,
};
