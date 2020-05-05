/**
 * Created by senro on 17/3/18.
 */
import React from 'react';
import {Router, Route,hashHistory,IndexRoute } from 'react-router';

import Page1 from 'page1/page1'


//{{mainLayout.import}}

export default class extends React.Component {
    render() {
        return (
            <Router history={ hashHistory }>
                <Route path="/Page1" component={Page1}/>

                {/*<Route path="systemLayoutNoBreadcrumb" component={SystemLayoutNoBreadcrumb}>*/}
                {/*    <Route path="/eventslist" component={Eventslist}/>*/}
                {/*    <Route path="/eventslistDetail" component={EventslistDetail}/>*/}
                {/*</Route>*/}

            </Router>
        )

    }
}
