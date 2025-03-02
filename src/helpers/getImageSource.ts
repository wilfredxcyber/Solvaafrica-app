export const getImageSource = (url: string | null) => {
    if (url) return { uri: url }

    return require('../../assets/images/placeholder.png')
}