syncPeople: function() {

        try {

            var rm = new sn_ws.RESTMessageV2(
                'Oracle People API',
                'Get People'
            );

            var response = rm.execute();

            var status = response.getStatusCode();
            var body = response.getBody();

            gs.info('Oracle People sync HTTP status: ' + status);

            if (status != 200) {
                gs.error(
                    'Oracle People sync failed. Status: ' +
                    status +
                    ' Body: ' +
                    body
                );

                return;
            }

            var payload = JSON.parse(body);

            if (!payload.items) {
                gs.error('Oracle People response did not contain items.');
                return;
            }

            var inserted = 0;
            var updated = 0;

            for (var i = 0; i < payload.items.length; i++) {

                var person = payload.items[i];

                var gr = new GlideRecord(
                    'u_oracle_person_staging'
                );

                gr.addQuery(
                    'u_oracle_id',
                    person.person_id + ''
                );

                gr.query();

                if (gr.next()) {

                    gr.u_name =
                        ((person.first_name || '') +
                        ' ' +
                        (person.last_name || '')).trim();

                    gr.u_email =
                        person.email || '';

                    gr.u_active =
                        person.active == 1;

                    gr.update();

                    updated++;

                } else {

                    gr.initialize();

                    gr.u_oracle_id =
                        person.person_id + '';

                    gr.u_name =
                        ((person.first_name || '') +
                        ' ' +
                        (person.last_name || '')).trim();

                    gr.u_email =
                        person.email || '';

                    gr.u_active =
                        person.active == 1;

                    gr.insert();

                    inserted++;
                }
            }

            gs.info(
                'Oracle People sync complete. Inserted: ' +
                inserted +
                ', Updated: ' +
                updated
            );

        } catch (ex) {

            gs.error(
                'Oracle People sync error: ' +
                ex.message
            );
        }
    },

