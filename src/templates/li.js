module.exports = offices => {
  return offices.map(office => `
    <li>
      <div class="office-image">
        <img src="${office.icon.src}" alt ="${office.icon.alt}" class="office-list-icon"/>
      </div>

      <div class="office-details">
        <h2>${office.name}</h2>
        <img src="${office.icon.src}" alt="${office.icon.alt}" class="nested-office-list-icon"/>

        <address>
          ${ office.address } <br/>
          ${ office.city }, ${ office.state } ${ office.zip }
        </address>


        ${office.url ? `<p><a href="${office.url}" target="_blank">Visit us on the web!</a></p>` : '' }
        ${office.facebook ? `<p><a href="${office.facebook}" target="_blank">Like us on Facebook!</a></p>` : '' }
        ${office.twitter ? `<p><a href="${office.twitter}" target="_blank">Follow us on Twitter!</a></p>` : '' }
      </div>
    </li>
  `)
}