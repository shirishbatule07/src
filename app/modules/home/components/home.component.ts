import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from '../services/quote.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	quote: string | undefined;
	isLoading = false;
	storeSubscription: Subscription;
	displayText: any;

	constructor(private quoteService: QuoteService, private store: Store<any>) {
		this.storeSubscription = this.store.select('displayText').subscribe(displayText => {
			this.displayText = displayText;
		});
	}

	ngOnInit(): void {
		this.isLoading = true;
		this.quoteService
			.getRandomQuote({ category: 'dev' })
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe((quote: string) => {
				this.quote = quote;
			});
	}

	ngOnDestroy(): void {
		this.storeSubscription.unsubscribe();
	}
}
