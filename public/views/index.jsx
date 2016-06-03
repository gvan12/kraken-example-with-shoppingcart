/*-------------------------------------------------------------------------------------------------------------------*\
 |  Copyright (C) 2015 PayPal                                                                                          |
 |                                                                                                                     |
 |  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance     |
 |  with the License.                                                                                                  |
 |                                                                                                                     |
 |  You may obtain a copy of the License at                                                                            |
 |                                                                                                                     |
 |       http://www.apache.org/licenses/LICENSE-2.0                                                                    |
 |                                                                                                                     |
 |  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed   |
 |  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for  |
 |  the specific language governing permissions and limitations under the License.                                     |
 \*-------------------------------------------------------------------------------------------------------------------*/

'use strict';

var React = require('react');
var $ = require('jquery');
var ps = require('pubsub-js');

module.exports = React.createClass({
	handleSubmit: function (e) {
		var self = this;
		e.preventDefault();
		console.log('submit!', e);
		$.ajax({
			url: '/cart',
			type: 'POST',
			dataType: 'json',
			data: {
				_csrf: this.props._csrf,
				item_id: $(e.target).data('productid')
			},
			cache: false,
			success: function (data) {
				console.log('data', data);
				ps.publish('cartUpdate', data.cart.totalItems);
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	render: function render() {
		var csrf = this.props._csrf;
		var msgs = this.props.messages.index;
		var products = this.props.products;
		var self = this;
		return (
		  <main role="main" >
			  <p>{msgs.greeting}</p>

			  <div className="products">
				  <ul className="nm-np inline">{
					  (products && products.length > 0) ? products.map(function (product) {
						  console.log('product', product);
						  return (
							<li key={product._id}>
								<form method="POST" action="cart" data-productid={product._id}
									  onSubmit={self.handleSubmit}>
									<h3 className="nm-np">{product.name}</h3>
									<h4 className="nm-np">{product.prettyPrice}</h4>
									<input type="submit" value={msgs.addToCart}/>
								</form>
							</li>
						  );
					  }) : <li>{msgs.noProducts}</li>
				  }</ul>
			  </div>
		  </main>
		);
	}
});