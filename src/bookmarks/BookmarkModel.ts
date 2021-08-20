import ArrayUtils from "../tsCommon/ArrayUtils";

export interface Bookmark {
  createTimestamp: number;
  updateTimestamp: number;
  uri: string;
  title: string;
  icon?: string;
  screenshot?: string;
}

export interface BookmarkGroup {
  createTimestamp: number,
  updateTimestamp: number,
  name: string,
  bookmarks: Bookmark[],
}

export interface BookmarkModel {
  updateTimestamp?: number,
  groups: Array<BookmarkGroup>,
}

export interface BookmarkState {
  currentGroupId: number,
  baseModel: BookmarkModel | null
  currentModel: BookmarkModel | null
}

export const initialState: BookmarkState = {
  currentGroupId: -1,
  baseModel: null,
  currentModel: null,
};

function getNewState(state: BookmarkState) {
  const newState = { ...state }
  const ts = Date.now();
  if (newState.currentModel == null) {
    if (newState.baseModel !== null) {
      newState.currentModel = JSON.parse(JSON.stringify(newState.baseModel));
      newState.currentModel!.updateTimestamp = ts;
    } else {
      newState.currentModel = { updateTimestamp: ts, groups: [] };
    }
  } else {
    newState.currentModel = JSON.parse(JSON.stringify(newState.currentModel));
  }
  return newState;
}

export class BookmarkUtil {
  private static addOrUpdateBookmarkToGroup(group: BookmarkGroup, bookmark: Bookmark) {
    const bmIndex = group.bookmarks.findIndex(el => el.uri === bookmark.uri);
    if (bmIndex === -1) {
      group.bookmarks.push(bookmark);
    } else {
      group.bookmarks[bmIndex] = bookmark;
    }
    group.updateTimestamp = Date.now()
  }

  private static findGroupInCurrentModel(groupId: number, state: BookmarkState) {
    return state.currentModel?.groups.find(g => g.createTimestamp === groupId);
  }

  static getGroup(groupId: number, state: BookmarkState): BookmarkGroup | undefined {
    const model = state.currentModel || state.baseModel;
    return model?.groups.find(g => g.createTimestamp === groupId);
  }

  static addBookmark(bookmark: Bookmark, state: BookmarkState): BookmarkState {
    const newState = state.currentGroupId === -1 ?
      this.addGroup(state) : getNewState(state);

    const destGroup = this.findGroupInCurrentModel(newState.currentGroupId, newState);
    if (!destGroup) {
      console.log('Could not find the group');
      console.log(newState);
      return state;
    } else {
      this.addOrUpdateBookmarkToGroup(destGroup, bookmark);
      return newState;
    }
  }

  static deleteBookmark(bmId: number, state: BookmarkState): BookmarkState {
    const newState = getNewState(state);
    const group = newState.currentModel!.groups.find(
      g => g.bookmarks.findIndex(b => b.createTimestamp === bmId) !== -1);
    if (!group) {
      console.log('Could not find the bookmark');
      return state;
    } else {
      ArrayUtils.deleteIf<Bookmark>(group.bookmarks, bm => bm.createTimestamp === bmId);
      return newState;
    }
  }

  static deleteAllBookmarks(groupId: number, state: BookmarkState): BookmarkState {
    const newState = getNewState(state);
    const group = this.findGroupInCurrentModel(groupId, newState);
    if (!group) {
      console.log('Could not find the bookmark');
      return state;
    } else {
      group.bookmarks = [];
      return newState;
    }
  }

  static setGroupName(groupId: number, name: string, state: BookmarkState): BookmarkState {
    const newState = getNewState(state);
    const group = this.findGroupInCurrentModel(groupId, newState);
    if (!group) {
      console.log('Could not find the bookmark');
      return state;
    } else if (group.name === name) {
      return state;
    } else {
      group.name = name;
      return newState;
    }
  }

  static addGroup(state: BookmarkState): BookmarkState {
    const newState = getNewState(state);
    const ts = Date.now();
    const newGroup: BookmarkGroup = {
      name: 'Untitled',
      createTimestamp: ts,
      updateTimestamp: ts,
      bookmarks: [],
    };
    newState.currentModel!.groups.push(newGroup);
    newState.currentGroupId = newGroup.createTimestamp!;
    return newState;
  }

  static deleteGroup(groupId: number, state: BookmarkState): BookmarkState {
    const newState = getNewState(state);
    const index = newState.currentModel!.groups.findIndex(g => g.createTimestamp === groupId);
    if (index == -1) {
      console.log('BookmarkGroup not found');
      return state;
    }
    newState.currentModel!.groups.splice(index, 1);
    if (newState.currentGroupId === groupId) newState.currentGroupId = -1;
    return newState;
  }

  static shouldSync(state: BookmarkState): boolean {
    return state.currentModel !== null && (
      state.baseModel === null ||
      state.currentModel!.updateTimestamp !== state.baseModel!.updateTimestamp);
  }

  private static mergeSyncedModel(state: BookmarkState, newModel: BookmarkModel | null) {
    const newState = getNewState(state);
    newState.baseModel = newModel;
    newState.currentModel = null;
    if (!newModel) {
      newState.currentGroupId = -1;
    } else if (!newModel.groups.find(g => g.createTimestamp === newState.currentGroupId)) {
      // If current group is removed after sync, choose first group
      newState.currentGroupId = newModel.groups.length > 0 ?
        newModel.groups[0].createTimestamp : -1;
    }
    return newState;
  }

  static async sync(state: BookmarkState, token: string): Promise<BookmarkState> {
    /* const formData = new FormData();
    if (state.baseModel) {
      formData.append('base', JSON.stringify(state.baseModel))
      formData.append('baseVersion', state.baseModel.updateTimestamp);
    } else {
      formData.append('baseVersion', -1);
    }
    if (state.currentModel) {
      formData.append('current', JSON.stringify(state.currentModel))
      formData.append('currentVersion', state.currentModel.updateTimestamp);
    } else {
      formData.append('currentVersion', -1);
    }
    return fetch(constants.ApiUrl + '/bookmarks/sync', {
      method: 'POST',
      headers: {
        FirebaseToken: token
      },
      body: formData
    }).then(response => response.json()).then(json => {
      const newModel = (json.bookmarks as BookmarkModel) || null;
      return this.mergeSyncedModel(state, newModel);
    });*/
  }

  static getGroups(state: BookmarkState) {
    return (state.currentModel || state.baseModel)?.groups || [];
  }
}

