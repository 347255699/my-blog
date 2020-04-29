module.exports = {
    head: [
        ['script', {src: "https://www.googletagmanager.com/gtag/js?id=UA-164957843-1", async: true}],
        ['script', {},
            "window.dataLayer = window.dataLayer || [];\
            function gtag(){dataLayer.push(arguments);}\
            gtag('js', new Date());\
            gtag('config', 'UA-164957843-1');"]
    ],
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
