module.exports = {
    title: 'Menfre Blog', // Title for the site. This will be displayed in the navbar.
    theme: '@vuepress/theme-blog',
    base: "/",
    themeConfig: {
        dateFormat: "YYYY-MM-DD",
        footer: {
            contact: [
                {
                    type: 'github',
                    link: 'https://github.com/347255699',
                }
            ],
            copyright: [
                {
                    text: 'Copyright © 2020 Menfre Blog.',
                    link: '',
                },
            ]
        }
    }
}
