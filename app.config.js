const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.bytegrn.solvaafrica.dev';
    }

    if (IS_PREVIEW) {
        return 'com.bytegrn.solvaafrica.preview';
    }

    return 'com.bytegrn.solvaafrica';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'Solva (Dev)';
    }

    if (IS_PREVIEW) {
        return 'Solva (Preview)';
    }

    return 'Solva';
};


export default ({ config }) => ({
    ...config,
    name: getAppName(),
    ios: {
        ...config.ios,
        bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
        ...config.android,
        package: getUniqueIdentifier(),
    },
})



