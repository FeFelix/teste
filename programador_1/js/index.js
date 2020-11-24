Vue.use(VueRouter);

const routes = [{
		path: '/',
		component: Home
	},
	{
		path: '/vendedores',
		component: Vendedores
	},
	{
		path: '/vendas',
		component: Vendas
	}
]

let router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	next()
});

var app = new Vue({
	el: '#app',
	watch: {},
	data: {
	},
	methods: {},
	router
});