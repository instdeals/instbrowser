import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexWithWrapping: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexCol1: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  flexRow1: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  horizontalCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  appContent: {
    marginLeft: 8,
    marginRight: 8,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  fullHeight: {
    height: '100%',
  },
  toolbarButton: {
    marginLeft: 8,
    minWidth: 64,
  },
  toolbar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  fullScreenModal: {
    backgroundColor: "white",
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default commonStyles;