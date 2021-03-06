import React from 'react'
import Router,{ Route } from 'react-router'
import createRoutes from './routes'
import { Provider } from 'react-redux'

const getFetchData = (component) => {
	return component.fetchData || (component.DecoratedComponent && component.DecoratedComponent.fetchData)
}

export function createTransitionHook(store) {
	return (nextState, transition, callback) => {
		Promise.all(nextState.branch
			.map(route => route.component)
			.filter(component => {
				return getFetchData(component)
			})
			.map(getFetchData)
			.map(fetchData => {
				return fetchData(store, nextState.params)
			}))
			.then(() => {
				callback() // can't just pass callback to then() because callback assumes first param is error
			}, (error) => {
				callback(error)
			})
	}
}

export default function universalRouter(location, history, store) {
	return new Promise((resolve, reject) => {
		let routes = createRoutes(store)
		Router.run(routes, location, [createTransitionHook(store)], (error, initialState, transition) => {
			if (error) {
				return reject(error)
			}

			if (transition && transition.redirectInfo) {
				return resolve({
					transition,
					isRedirect: true
				})
			}
			if (history) {  // only on client side
				initialState.history = history
			}

			let component = (
				<div>
					<Provider store={store} key="provider">
						{() => <Router {...initialState} children={routes}/>}
					</Provider>
				</div>
			)

			return resolve({
				component,
				isRedirect: false
			})
		})
	})
}
