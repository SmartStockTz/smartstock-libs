import {Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from '@angular/common';
import {UserService} from '../services/user.service';

@Pipe({
  name: 'fedha'
})

export class FedhaPipe implements PipeTransform {

  constructor(private readonly userService: UserService) {
  }

  async transform(value: any, ...args: any[]): Promise<string> {
    if (Number.isNaN(value)) {
      return value;
    }
    const c = await this.userService.getCurrentShop();
    return `${c && c.settings && c.settings.currency ? c.settings.currency : ''} ${formatNumber(value, 'en-US')}`;
  }
}
