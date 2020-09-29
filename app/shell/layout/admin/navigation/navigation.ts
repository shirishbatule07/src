import { Injectable } from '@angular/core';

export interface NavigationItem {
	id: string;
	title: string;
	type: 'item' | 'collapse' | 'group';
	translate?: string;
	icon?: string;
	hidden?: boolean;
	url?: string;
	classes?: string;
	exactMatch?: boolean;
	external?: boolean;
	target?: boolean;
	breadcrumbs?: boolean;
	function?: any;
	badge?: {
		title?: string;
		type?: string;
	};
	children?: Navigation[];
}

export interface Navigation extends NavigationItem {
	children?: NavigationItem[];
}

const NavigationItems = [
	{
		id: 'navigation',
		title: 'navigation',
		type: 'group',
		icon: 'icon-other',
		children: [
			{
				id: 'dashboard',
				title: 'Dashboard',
				type: 'item',
				url: '/home',
				classes: 'nav-item',
				icon: 'feather icon-sidebar'
			},
			{
				id: 'masters',
				title: 'Masters',
				type: 'collapse',
				icon: 'feather icon-menu',
				children: [
					{
						id: 'item-master',
						title: 'Item Master',
						type: 'item',
						url: '/master/item-master'
					},
					{
						id: 'categories',
						title: 'Category',
						type: 'collapse',
						children: [
							{
								id: 'menu-level-2.2.1',
								title: 'Category Master 1',
								type: 'item',
								url: '/master/category1-master',
								external: false
							},
							{
								id: 'menu-level-2.2.2',
								title: 'Category Master 2',
								type: 'item',
								url: '/master/category2-master',
								external: false
							}
						]
					}
				]
			},
			{
				id: 'disabled-menu',
				title: 'Disabled Menu',
				type: 'item',
				url: 'javascript:',
				classes: 'nav-item disabled',
				icon: 'feather icon-power',
				external: true
			}
		]
	}
];

@Injectable()
export class NavigationItem {
	get() {
		return NavigationItems;
	}
}
