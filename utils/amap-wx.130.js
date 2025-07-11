function AMapWX(a) {
	this.key = a.key;
	this.requestConfig = {
		key: a.key,
		s: "rsx",
		platform: "WXJS",
		appname: a.key,
		sdkversion: "1.2.0",
		logversion: "2.0"
	};
	this.MeRequestConfig = {
		key: a.key,
		serviceName: "https://restapi.amap.com/rest/me"
	}
}
AMapWX.prototype.getWxLocation = function(a, b) {
	wx.getLocation({
		type: "gcj02",
		success: function(c) {
			c = c.longitude + "," + c.latitude;
			wx.setStorage({
				key: "userLocation",
				data: c
			});
			b(c)
		},
		fail: function(c) {
			wx.getStorage({
				key: "userLocation",
				success: function(d) {
					d.data && b(d.data)
				}
			});
			a.fail({
				errCode: "0",
				errMsg: c.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getMEKeywordsSearch = function(a) {
	if (!a.options) return a.fail({
		errCode: "0",
		errMsg: "\u7f3a\u5c11\u5fc5\u8981\u53c2\u6570"
	});
	var b = a.options,
		c = this.MeRequestConfig,
		d = {
			key: c.key,
			s: "rsx",
			platform: "WXJS",
			appname: a.key,
			sdkversion: "1.2.0",
			logversion: "2.0"
		};
	b.layerId && (d.layerId = b.layerId);
	b.keywords && (d.keywords = b.keywords);
	b.city && (d.city = b.city);
	b.filter && (d.filter = b.filter);
	b.sortrule && (d.sortrule = b.sortrule);
	b.pageNum && (d.pageNum = b.pageNum);
	b.pageSize && (d.pageSize = b.pageSize);
	b.sig && (d.sig =
		b.sig);
	wx.request({
		url: c.serviceName + "/cpoint/datasearch/local",
		data: d,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(e) {
			(e = e.data) && e.status && "1" === e.status && 0 === e.code ? a.success(e.data) : a.fail({
				errCode: "0",
				errMsg: e
			})
		},
		fail: function(e) {
			a.fail({
				errCode: "0",
				errMsg: e.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getMEIdSearch = function(a) {
	if (!a.options) return a.fail({
		errCode: "0",
		errMsg: "\u7f3a\u5c11\u5fc5\u8981\u53c2\u6570"
	});
	var b = a.options,
		c = this.MeRequestConfig,
		d = {
			key: c.key,
			s: "rsx",
			platform: "WXJS",
			appname: a.key,
			sdkversion: "1.2.0",
			logversion: "2.0"
		};
	b.layerId && (d.layerId = b.layerId);
	b.id && (d.id = b.id);
	b.sig && (d.sig = b.sig);
	wx.request({
		url: c.serviceName + "/cpoint/datasearch/id",
		data: d,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(e) {
			(e = e.data) && e.status && "1" === e.status &&
				0 === e.code ? a.success(e.data) : a.fail({
					errCode: "0",
					errMsg: e
				})
		},
		fail: function(e) {
			a.fail({
				errCode: "0",
				errMsg: e.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getMEPolygonSearch = function(a) {
	if (!a.options) return a.fail({
		errCode: "0",
		errMsg: "\u7f3a\u5c11\u5fc5\u8981\u53c2\u6570"
	});
	var b = a.options,
		c = this.MeRequestConfig,
		d = {
			key: c.key,
			s: "rsx",
			platform: "WXJS",
			appname: a.key,
			sdkversion: "1.2.0",
			logversion: "2.0"
		};
	b.layerId && (d.layerId = b.layerId);
	b.keywords && (d.keywords = b.keywords);
	b.polygon && (d.polygon = b.polygon);
	b.filter && (d.filter = b.filter);
	b.sortrule && (d.sortrule = b.sortrule);
	b.pageNum && (d.pageNum = b.pageNum);
	b.pageSize && (d.pageSize = b.pageSize);
	b.sig && (d.sig = b.sig);
	wx.request({
		url: c.serviceName + "/cpoint/datasearch/polygon",
		data: d,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(e) {
			(e = e.data) && e.status && "1" === e.status && 0 === e.code ? a.success(e.data) : a.fail({
				errCode: "0",
				errMsg: e
			})
		},
		fail: function(e) {
			a.fail({
				errCode: "0",
				errMsg: e.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getMEaroundSearch = function(a) {
	if (!a.options) return a.fail({
		errCode: "0",
		errMsg: "\u7f3a\u5c11\u5fc5\u8981\u53c2\u6570"
	});
	var b = a.options,
		c = this.MeRequestConfig,
		d = {
			key: c.key,
			s: "rsx",
			platform: "WXJS",
			appname: a.key,
			sdkversion: "1.2.0",
			logversion: "2.0"
		};
	b.layerId && (d.layerId = b.layerId);
	b.keywords && (d.keywords = b.keywords);
	b.center && (d.center = b.center);
	b.radius && (d.radius = b.radius);
	b.filter && (d.filter = b.filter);
	b.sortrule && (d.sortrule = b.sortrule);
	b.pageNum && (d.pageNum = b.pageNum);
	b.pageSize &&
		(d.pageSize = b.pageSize);
	b.sig && (d.sig = b.sig);
	wx.request({
		url: c.serviceName + "/cpoint/datasearch/around",
		data: d,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(e) {
			(e = e.data) && e.status && "1" === e.status && 0 === e.code ? a.success(e.data) : a.fail({
				errCode: "0",
				errMsg: e
			})
		},
		fail: function(e) {
			a.fail({
				errCode: "0",
				errMsg: e.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getGeo = function(a) {
	var b = this.requestConfig,
		c = a.options;
	b = {
		key: this.key,
		extensions: "all",
		s: b.s,
		platform: b.platform,
		appname: this.key,
		sdkversion: b.sdkversion,
		logversion: b.logversion
	};
	c.address && (b.address = c.address);
	c.city && (b.city = c.city);
	c.batch && (b.batch = c.batch);
	c.sig && (b.sig = c.sig);
	wx.request({
		url: "https://restapi.amap.com/v3/geocode/geo",
		data: b,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(d) {
			(d = d.data) && d.status && "1" === d.status ? a.success(d) : a.fail({
				errCode: "0",
				errMsg: d
			})
		},
		fail: function(d) {
			a.fail({
				errCode: "0",
				errMsg: d.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getRegeo = function(a) {
	function b(d) {
		var e = c.requestConfig;
		wx.request({
			url: "https://restapi.amap.com/v3/geocode/regeo",
			data: {
				key: c.key,
				location: d,
				extensions: "all",
				s: e.s,
				platform: e.platform,
				appname: c.key,
				sdkversion: e.sdkversion,
				logversion: e.logversion
			},
			method: "GET",
			header: {
				"content-type": "application/json"
			},
			success: function(g) {
				if (g.data.status && "1" == g.data.status) {
					g = g.data.regeocode;
					var h = g.addressComponent,
						f = [],
						k = g.roads[0].name + "\u9644\u8fd1",
						m = d.split(",")[0],
						n = d.split(",")[1];
					if (g.pois &&
						g.pois[0]) {
						k = g.pois[0].name + "\u9644\u8fd1";
						var l = g.pois[0].location;
						l && (m = parseFloat(l.split(",")[0]), n = parseFloat(l.split(",")[1]))
					}
					h.provice && f.push(h.provice);
					h.city && f.push(h.city);
					h.district && f.push(h.district);
					h.streetNumber && h.streetNumber.street && h.streetNumber.number ? (f.push(h
						.streetNumber.street), f.push(h.streetNumber.number)) : f.push(g.roads[0]
						.name);
					f = f.join("");
					a.success([{
						iconPath: a.iconPath,
						width: a.iconWidth,
						height: a.iconHeight,
						name: f,
						desc: k,
						longitude: m,
						latitude: n,
						id: 0,
						regeocodeData: g
					}])
				} else a.fail({
					errCode: g.data.infocode,
					errMsg: g.data.info
				})
			},
			fail: function(g) {
				a.fail({
					errCode: "0",
					errMsg: g.errMsg || ""
				})
			}
		})
	}
	var c = this;
	a.location ? b(a.location) : c.getWxLocation(a, function(d) {
		b(d)
	})
};
AMapWX.prototype.getWeather = function(a) {
	function b(g) {
		var h = "base";
		a.type && "forecast" == a.type && (h = "all");
		wx.request({
			url: "https://restapi.amap.com/v3/weather/weatherInfo",
			data: {
				key: d.key,
				city: g,
				extensions: h,
				s: e.s,
				platform: e.platform,
				appname: d.key,
				sdkversion: e.sdkversion,
				logversion: e.logversion
			},
			method: "GET",
			header: {
				"content-type": "application/json"
			},
			success: function(f) {
				if (f.data.status && "1" == f.data.status)
					if (f.data.lives) {
						if ((f = f.data.lives) && 0 < f.length) {
							f = f[0];
							var k = {
								city: {
									text: "\u57ce\u5e02",
									data: f.city
								},
								weather: {
									text: "\u5929\u6c14",
									data: f.weather
								},
								temperature: {
									text: "\u6e29\u5ea6",
									data: f.temperature
								},
								winddirection: {
									text: "\u98ce\u5411",
									data: f.winddirection + "\u98ce"
								},
								windpower: {
									text: "\u98ce\u529b",
									data: f.windpower + "\u7ea7"
								},
								humidity: {
									text: "\u6e7f\u5ea6",
									data: f.humidity + "%"
								}
							};
							k.liveData = f;
							a.success(k)
						}
					} else f.data.forecasts && f.data.forecasts[0] && a.success({
						forecast: f.data.forecasts[0]
					});
				else a.fail({
					errCode: f.data.infocode,
					errMsg: f.data.info
				})
			},
			fail: function(f) {
				a.fail({
					errCode: "0",
					errMsg: f.errMsg || ""
				})
			}
		})
	}

	function c(g) {
		wx.request({
			url: "https://restapi.amap.com/v3/geocode/regeo",
			data: {
				key: d.key,
				location: g,
				extensions: "all",
				s: e.s,
				platform: e.platform,
				appname: d.key,
				sdkversion: e.sdkversion,
				logversion: e.logversion
			},
			method: "GET",
			header: {
				"content-type": "application/json"
			},
			success: function(h) {
				if (h.data.status && "1" == h.data.status) {
					h = h.data.regeocode;
					if (h.addressComponent) var f = h.addressComponent.adcode;
					else h.aois && 0 < h.aois.length && (f = h.aois[0].adcode);
					b(f)
				} else a.fail({
					errCode: h.data.infocode,
					errMsg: h.data.info
				})
			},
			fail: function(h) {
				a.fail({
					errCode: "0",
					errMsg: h.errMsg || ""
				})
			}
		})
	}
	var d = this,
		e = d.requestConfig;
	a.city ? b(a.city) : d.getWxLocation(a, function(g) {
		c(g)
	})
};
AMapWX.prototype.getPoiAround = function(a) {
	function b(e) {
		e = {
			key: c.key,
			location: e,
			s: d.s,
			platform: d.platform,
			appname: c.key,
			sdkversion: d.sdkversion,
			logversion: d.logversion
		};
		a.querytypes && (e.types = a.querytypes);
		a.querykeywords && (e.keywords = a.querykeywords);
		wx.request({
			url: "https://restapi.amap.com/v3/place/around",
			data: e,
			method: "GET",
			header: {
				"content-type": "application/json"
			},
			success: function(g) {
				if (g.data.status && "1" == g.data.status) {
					if ((g = g.data) && g.pois) {
						for (var h = [], f = 0; f < g.pois.length; f++) {
							var k = 0 ==
								f ? a.iconPathSelected : a.iconPath;
							h.push({
								latitude: parseFloat(g.pois[f].location.split(",")[1]),
								longitude: parseFloat(g.pois[f].location.split(",")[0]),
								iconPath: k,
								width: 22,
								height: 32,
								id: f,
								name: g.pois[f].name,
								address: g.pois[f].address
							})
						}
						a.success({
							markers: h,
							poisData: g.pois
						})
					}
				} else a.fail({
					errCode: g.data.infocode,
					errMsg: g.data.info
				})
			},
			fail: function(g) {
				a.fail({
					errCode: "0",
					errMsg: g.errMsg || ""
				})
			}
		})
	}
	var c = this,
		d = c.requestConfig;
	a.location ? b(a.location) : c.getWxLocation(a, function(e) {
		b(e)
	})
};
AMapWX.prototype.getStaticmap = function(a) {
	function b(e) {
		c.push("location=" + e);
		a.zoom && c.push("zoom=" + a.zoom);
		a.size && c.push("size=" + a.size);
		a.scale && c.push("scale=" + a.scale);
		a.markers && c.push("markers=" + a.markers);
		a.labels && c.push("labels=" + a.labels);
		a.paths && c.push("paths=" + a.paths);
		a.traffic && c.push("traffic=" + a.traffic);
		e = "https://restapi.amap.com/v3/staticmap?" + c.join("&");
		a.success({
			url: e
		})
	}
	var c = [];
	c.push("key=" + this.key);
	var d = this.requestConfig;
	c.push("s=" + d.s);
	c.push("platform=" + d.platform);
	c.push("appname=" + d.appname);
	c.push("sdkversion=" + d.sdkversion);
	c.push("logversion=" + d.logversion);
	a.location ? b(a.location) : this.getWxLocation(a, function(e) {
		b(e)
	})
};
AMapWX.prototype.getInputtips = function(a) {
	var b = Object.assign({}, this.requestConfig);
	a.location && (b.location = a.location);
	a.keywords && (b.keywords = a.keywords);
	a.type && (b.type = a.type);
	a.city && (b.city = a.city);
	a.citylimit && (b.citylimit = a.citylimit);
	wx.request({
		url: "https://restapi.amap.com/v3/assistant/inputtips",
		data: b,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(c) {
			c && c.data && c.data.tips && a.success({
				tips: c.data.tips
			})
		},
		fail: function(c) {
			a.fail({
				errCode: "0",
				errMsg: c.errMsg ||
					""
			})
		}
	})
};
AMapWX.prototype.getDrivingRoute = function(a) {
	var b = Object.assign({}, this.requestConfig);
	a.origin && (b.origin = a.origin);
	a.destination && (b.destination = a.destination);
	a.strategy && (b.strategy = a.strategy);
	a.waypoints && (b.waypoints = a.waypoints);
	a.avoidpolygons && (b.avoidpolygons = a.avoidpolygons);
	a.avoidroad && (b.avoidroad = a.avoidroad);
	wx.request({
		url: "https://restapi.amap.com/v3/direction/driving",
		data: b,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(c) {
			c && c.data && c.data.route && a.success({
				paths: c.data.route.paths,
				taxi_cost: c.data.route.taxi_cost || ""
			})
		},
		fail: function(c) {
			a.fail({
				errCode: "0",
				errMsg: c.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getWalkingRoute = function(a) {
	var b = Object.assign({}, this.requestConfig);
	a.origin && (b.origin = a.origin);
	a.destination && (b.destination = a.destination);
	wx.request({
		url: "https://restapi.amap.com/v3/direction/walking",
		data: b,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(c) {
			c && c.data && c.data.route && a.success({
				paths: c.data.route.paths
			})
		},
		fail: function(c) {
			a.fail({
				errCode: "0",
				errMsg: c.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getTransitRoute = function(a) {
	var b = Object.assign({}, this.requestConfig);
	a.origin && (b.origin = a.origin);
	a.destination && (b.destination = a.destination);
	a.strategy && (b.strategy = a.strategy);
	a.city && (b.city = a.city);
	a.cityd && (b.cityd = a.cityd);
	wx.request({
		url: "https://restapi.amap.com/v3/direction/transit/integrated",
		data: b,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(c) {
			c && c.data && c.data.route && (c = c.data.route, a.success({
				distance: c.distance || "",
				taxi_cost: c.taxi_cost ||
					"",
				transits: c.transits
			}))
		},
		fail: function(c) {
			a.fail({
				errCode: "0",
				errMsg: c.errMsg || ""
			})
		}
	})
};
AMapWX.prototype.getRidingRoute = function(a) {
	var b = Object.assign({}, this.requestConfig);
	a.origin && (b.origin = a.origin);
	a.destination && (b.destination = a.destination);
	wx.request({
		url: "https://restapi.amap.com/v3/direction/riding",
		data: b,
		method: "GET",
		header: {
			"content-type": "application/json"
		},
		success: function(c) {
			c && c.data && c.data.route && a.success({
				paths: c.data.route.paths
			})
		},
		fail: function(c) {
			a.fail({
				errCode: "0",
				errMsg: c.errMsg || ""
			})
		}
	})
};
// module.exports.AMapWX = AMapWX;
export default { AMapWX };