// src/modules/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DateRangeDto, DaysDto, LimitDto } from './dtos/date-range.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('overview')
  overview(@Query() q: DateRangeDto) {
    return this.reports.overview(q.from, q.to);
  }

  @Get('sales-by-day')
  salesByDay(@Query() q: DaysDto) {
    return this.reports.salesByDay(q.days ?? 30);
  }

  @Get('sales-by-category')
  salesByCategory(@Query() q: DateRangeDto) {
    return this.reports.salesByCategory(q.from, q.to);
  }

  @Get('top-products')
  topProducts(@Query() q: DateRangeDto & LimitDto) {
    return this.reports.topProducts(q.limit ?? 10, q.from, q.to);
  }

  @Get('order-status-breakdown')
  orderStatusBreakdown(@Query() q: DateRangeDto) {
    return this.reports.orderStatusBreakdown(q.from, q.to);
  }

  @Get('new-users-by-week')
  newUsersByWeek(@Query() q: DaysDto) {
    const weeks = q.days ? Math.max(1, Math.floor(q.days / 7)) : 12;
    return this.reports.newUsersByWeek(weeks);
  }

  @Get('low-stock')
  lowStock(@Query('threshold') threshold?: string) {
    return this.reports.lowStock(threshold ? parseInt(threshold, 10) : 5);
  }
}
