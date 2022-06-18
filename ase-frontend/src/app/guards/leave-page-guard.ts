import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

export interface CanComponentLeave {
  canLeave: () => boolean | Observable<boolean> | Promise<boolean>;
}

export class LeavePageGuard implements CanDeactivate<CanComponentLeave> {
  canDeactivate(
    component: CanComponentLeave,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot | undefined
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return component.canLeave();
  }
}
