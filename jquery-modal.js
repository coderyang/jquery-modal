;(function(){

	function Modal(el, opts) {

		var defaults = {
			overlayClicked: "dismiss"
		};

		this.opts = $.extend({}, defaults, opts);

		this.$el = $(el);

		this.uid = 0;

		this.opened = false;

		this.lastFocus = null;

		this.init();

	}

	Modal.prototype.init = function() {
		
		var self = this;

		this.$target = $(this.$el.data("target"));

		if (!this.$target.length) {
			return ;
		}

		if (this.$target.is(":not(:hidden)")) {
			this.$target.hide();
		}

		$(window).on("focus", function(){
			if (self.opened) {
				self.$target.focus();
			}
		})


		this.$el.on("click", function(e){
			e.preventDefault();

			$("html").css("overflow", "hidden");

			if (!$(".modal-overlay").length) {
				$("<div class='modal-overlay'></div>")
					.appendTo("body");
			}

			self.lastFocus = document.activeElement;

			$(document)
				.queue("modal", function(){
					$(".modal-overlay").show();
					self.$target.show();

					self.opened = true;

				})
				.queue("tab", function(){
					self.$target.attr("tabIndex", "0");
					self.$target.focus();
				})
				.dequeue("modal")
				.dequeue("tab");


			e.stopPropagation();
		});

		$(".modal-close").on("click", function(e){
			e.preventDefault();

			$(document)
				.queue("modal", function(){
					$(".modal-overlay").hide();
					self.$target.hide();
					$("html").css("overflow", "auto");
				})
				.dequeue("modal");

			self.opened = false;

			$(self.lastFocus).focus();

			e.stopPropagation();
		});

		$(document).on("keydown", function(e){
			if (!e.keyCode || e.keyCode == 27) {
				$(".modal-close").trigger("click");
			}
		});

		if (this.opts["overlayClicked"] == "dismiss") {
			$(document).on("click", function(e){
				if (!$(e.target).closest(self.$target).length) {
					if (self.$target.is(":visible")) {
						$(".modal-close").trigger("click");
					}
				}
			});
		}

	}


	$.fn.modal = function(opts) {
		this.each(function(){
			return new Modal(this, opts);
		});
	}

})(jQuery);