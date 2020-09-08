import { AppPage } from './app.po';
import { getCurrentRouteUrl } from '../utils/utils';

describe('App Main page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should redirect to school list page', () => {
    page.navigateTo();
    expect(getCurrentRouteUrl()).toEqual('schools');
  });
});
