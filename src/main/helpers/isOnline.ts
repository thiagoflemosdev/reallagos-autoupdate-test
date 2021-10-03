import isOnlinePackage from 'is-online';

export function isOnline(timeout = 3000) {
    return new Promise<boolean>((resolve) => {
        isOnlinePackage({ timeout }).then(resolve);
    })
}