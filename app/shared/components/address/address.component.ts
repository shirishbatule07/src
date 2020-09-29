import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { CommonService } from '@app/shared/services';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {
  @Input() addressForm: FormGroup;
  cityOptions: any = [];
  stateOptions: any = [];

  constructor(private commonService: CommonService) { }

  ngOnInit() { }

  getCountries(baseContext: AddressComponent, term: string) {
    return baseContext.commonService
      .getCountries({
        searchTerm: term,
        pageNumber: 1,
        pageSize: 100
      })
      .pipe(
        map((res: any) => res.countries),
        map((countries: any) => {
          return countries.map((country: any) => ({ label: country.name, value: country.id }));
        })
      );
  }
  getCities(baseContext: AddressComponent, term: string) {
    return baseContext.commonService
      .getCities({
        searchTerm: term,
        pageNumber: 1,
        pageSize: term ? 100 : 10
      })
      .pipe(
        map((res: any) => res.cities),
        map((cities: any) => {
          return cities.map((city: any) => ({
            ...city,
            label: `${city.name}, ${city.stateName}, ${city.countryName}`,
            value: city.id
          }));
        })
      );
  }
  getStates(baseContext: AddressComponent, term: string) {
    return baseContext.commonService
      .getStates({
        searchTerm: term,
        pageNumber: 1,
        pageSize: 100
      })
      .pipe(
        map((res: any) => res.states),
        map((states: any) => {
          return states.map((state: any) => ({ label: state.name, value: state.id }));
        })
      );
  }
}
