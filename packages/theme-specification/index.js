import figmaTokens from './figma-tokens/tokens.json'
import { colors as twColors } from '@unocss/preset-mini/dist/chunks/colors.cjs'

let themes = figmaTokens

if (themes?.global) delete themes.global

const colorParser = ({ value }) => {
  if (value.match(/{colors.*}/)) {
    const [, color, level] = value.replace(/[{}]/g, '').split('.')
    return twColors[color]?.[level] ?? twColors[color]
  }
  if (value.match(/#*/)) return value
}

const parseThemeColors = ({ theme }) => {
  const themeCategories = Object.entries(theme)

  const colorCategories = themeCategories.reduce((categories, category) => {
    const [categoryName, items] = category

    const itemList = Object.entries(items)

    const colors = itemList.reduce((result, item) => {
      const [itemName, attrs] = item

      if (attrs?.type === 'color') {
        const colorName = `${categoryName}${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`
        const colorValue = colorParser({ value: attrs.value })
        return { ...result, [colorName]: colorValue }
      }
    }, {})

    return { ...categories, ...colors }
  }, {})
  return colorCategories
}

const themeTypes = Object.keys(themes)

const themeColors = themeTypes.reduce((result, themeType) => {
  const groupedColors = { [themeType]: parseThemeColors({ theme: themes[themeType] }) }

  return { ...result, ...groupedColors }
}, {})

export { themeColors }
