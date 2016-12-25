

export function handleFloatItemTap(e, context) {
  const index = e.target.dataset.index
  context = context || this
  const floatMenuData = context.data.floatMenu
  let handleTap
  if (index < 0) {
    handleTap = floatMenuData.mainItem.handleTap
  } else {
    handleTap = floatMenuData.subItems[index].handleTap
  }
  handleTap && handleTap(e)
}

export function initFloatMenu({
  mainItem = { url: '../../resources/images/menu.png', closeUrl: '../../resources/images/close.png' },
  subItems = [
    { url: '../../resources/images/star.png', handleTap: (e) => console.log(e) },
    { url: '../../resources/images/list.png', handleTap: (e) => console.log(e) },
  ],
  mainItemSize = 45,
  subItemSize = 35,
  subItemMargin = 10,
  context = null,
  showSubItems = false
} = {}) {
  if (context === null) throw new Error('Context must be a page instance!')
  const foldedSubItemsY = subItems.length * (subItemSize + subItemMargin) + mainItemSize + 10
  const unfoldedSubItemsY = - mainItemSize - subItemMargin
  const floatMenu = {
    mainItem,
    subItems,
    mainItemSize,
    subItemSize,
    subItemMargin,
    subItemsY: showSubItems ? unfoldedSubItemsY : foldedSubItemsY,
    minHeight: Math.max(foldedSubItemsY, mainItemSize),
    minWidth: Math.max(subItemSize, mainItemSize),
    foldedSubItemsY: - (mainItemSize - subItemSize)/2,
  }
  mainItem.cur_url = mainItem.url

  if (subItems.length > 0) {
    let mainItemUrl = mainItem.url
    let mainItemCloseUrl = mainItem.closeUrl
    floatMenu.mainItem.rotate = 0
    mainItem.handleTap = e => {
      floatMenu.showSubItems = !floatMenu.showSubItems
      floatMenu.mainItem.rotate += 180
      context.setData({ floatMenu })
      setTimeout(() => {
        floatMenu.mainItem.cur_url = floatMenu.showSubItems
          ? mainItemCloseUrl
          : mainItemUrl
        context.setData({ floatMenu })
      }, 300)
    }
  }
  context.handleFloatItemTap = handleFloatItemTap
  context.setData({ floatMenu })
  return floatMenu
}
